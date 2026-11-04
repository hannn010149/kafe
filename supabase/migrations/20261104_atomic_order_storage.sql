ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    existing_policy RECORD;
BEGIN
    FOR existing_policy IN
        SELECT schemaname, tablename, policyname
        FROM pg_catalog.pg_policies
        WHERE schemaname = 'public'
          AND tablename IN ('bookings', 'orders', 'order_items', 'customers', 'transactions')
    LOOP
        EXECUTE pg_catalog.format(
            'DROP POLICY %I ON %I.%I',
            existing_policy.policyname,
            existing_policy.schemaname,
            existing_policy.tablename
        );
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_order_with_items(
    p_order JSONB,
    p_items JSONB,
    p_transaction_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    created_order public.orders;
    created_items JSONB;
BEGIN
    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
        RAISE EXCEPTION 'Order items must be a JSON array' USING ERRCODE = '22023';
    END IF;
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'At least one order item is required' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.orders (
        order_code, order_type, table_number, customer_name, customer_phone,
        customer_email, notes, subtotal, tax_amount, service_amount,
        total_amount, payment_method, payment_status, status, created_at
    )
    VALUES (
        p_order ->> 'order_code',
        p_order ->> 'order_type',
        NULLIF(p_order ->> 'table_number', ''),
        p_order ->> 'customer_name',
        p_order ->> 'customer_phone',
        NULLIF(p_order ->> 'customer_email', ''),
        NULLIF(p_order ->> 'notes', ''),
        (p_order ->> 'subtotal')::NUMERIC,
        (p_order ->> 'tax_amount')::NUMERIC,
        (p_order ->> 'service_amount')::NUMERIC,
        (p_order ->> 'total_amount')::NUMERIC,
        p_order ->> 'payment_method',
        p_order ->> 'payment_status',
        p_order ->> 'status',
        (p_order ->> 'created_at')::TIMESTAMPTZ
    )
    RETURNING * INTO created_order;

    INSERT INTO public.order_items (
        order_id, product_id, product_name, product_image, price,
        quantity, options, subtotal
    )
    SELECT
        created_order.id,
        CASE
            WHEN item ->> 'product_id' ~*
                '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (item ->> 'product_id')::UUID
            ELSE NULL
        END,
        item ->> 'product_name',
        NULLIF(item ->> 'product_image', ''),
        (item ->> 'price')::NUMERIC,
        (item ->> 'quantity')::INTEGER,
        COALESCE(NULLIF(item -> 'options', 'null'::JSONB), '{}'::JSONB),
        (item ->> 'subtotal')::NUMERIC
    FROM jsonb_array_elements(p_items) AS item_row(item);

    INSERT INTO public.transactions (
        transaction_code, order_id, amount, payment_method, status, created_at
    )
    VALUES (
        p_transaction_code,
        created_order.id,
        created_order.total_amount,
        created_order.payment_method,
        created_order.payment_status,
        created_order.created_at
    );

    INSERT INTO public.customers (
        name, phone, email, total_orders, total_spent, last_visit
    )
    VALUES (
        created_order.customer_name,
        created_order.customer_phone,
        created_order.customer_email,
        1,
        created_order.total_amount,
        created_order.created_at
    )
    ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        email = COALESCE(EXCLUDED.email, public.customers.email),
        total_orders = COALESCE(public.customers.total_orders, 0) + 1,
        total_spent = COALESCE(public.customers.total_spent, 0) + EXCLUDED.total_spent,
        last_visit = EXCLUDED.last_visit;

    SELECT COALESCE(
        jsonb_agg(to_jsonb(order_item) ORDER BY order_item.created_at, order_item.id),
        '[]'::JSONB
    )
    INTO created_items
    FROM public.order_items AS order_item
    WHERE order_item.order_id = created_order.id;

    RETURN to_jsonb(created_order) || jsonb_build_object('items', created_items);
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_with_items(JSONB, JSONB, TEXT)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB, TEXT)
    TO service_role;

CREATE OR REPLACE FUNCTION public.update_order_status(
    p_order_id UUID,
    p_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    updated_order public.orders;
    updated_items JSONB;
BEGIN
    IF p_status IS NULL OR p_status NOT IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid order status' USING ERRCODE = '22023';
    END IF;

    UPDATE public.orders
    SET
        status = p_status,
        payment_status = CASE WHEN p_status = 'completed' THEN 'paid' ELSE payment_status END,
        updated_at = pg_catalog.now()
    WHERE id = p_order_id
    RETURNING * INTO updated_order;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    UPDATE public.transactions
    SET status = updated_order.payment_status
    WHERE order_id = updated_order.id;

    SELECT COALESCE(
        pg_catalog.jsonb_agg(
            pg_catalog.to_jsonb(order_item)
            ORDER BY order_item.created_at, order_item.id
        ),
        '[]'::JSONB
    )
    INTO updated_items
    FROM public.order_items AS order_item
    WHERE order_item.order_id = updated_order.id;

    RETURN pg_catalog.to_jsonb(updated_order)
        || pg_catalog.jsonb_build_object('items', updated_items);
END;
$$;

REVOKE ALL ON FUNCTION public.update_order_status(UUID, TEXT)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_order_status(UUID, TEXT)
    TO service_role;
