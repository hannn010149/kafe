-- ====================================================================
-- KOMOREBI CAFE MANAGEMENT DATABASE SCHEMA (PostgreSQL / Supabase)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CAFE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS cafe_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Komorebi Café & Roastery',
    kanji_name VARCHAR(100) DEFAULT '木漏れ日 喫茶',
    tagline VARCHAR(255) DEFAULT 'Artisanal Coffee & Japanese Wabi-Sabi Tea House',
    description TEXT DEFAULT 'Sebuah ruang tenang di tengah hiruk pikuk kota, menyajikan racikan matcha murni dari Uji Kyoto, artisan coffee pilihan, dan kudapan khas dengan filosofi ketenangan Wabi-Sabi.',
    logo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
    banner_url TEXT DEFAULT 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80',
    address TEXT DEFAULT 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190',
    whatsapp VARCHAR(50) DEFAULT '6281234567890',
    phone VARCHAR(50) DEFAULT '+62 21 5566 7788',
    email VARCHAR(100) DEFAULT 'hello@komorebicafe.id',
    instagram VARCHAR(100) DEFAULT '@komorebi.cafe',
    tiktok VARCHAR(100) DEFAULT '@komorebi_cafe',
    maps_url TEXT DEFAULT 'https://maps.google.com/?q=Jakarta',
    opening_hours JSONB DEFAULT '{"weekdays": "08:00 - 22:00", "weekends": "07:00 - 23:00"}'::jsonb,
    primary_color VARCHAR(20) DEFAULT '#536B54',
    currency_symbol VARCHAR(10) DEFAULT 'Rp',
    tax_percentage NUMERIC(5,2) DEFAULT 10.0,
    service_percentage NUMERIC(5,2) DEFAULT 5.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    description_en TEXT,
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_en TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    stock INT DEFAULT 100,
    calories INT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    variants JSONB DEFAULT '{"size": [{"name": "Regular", "extra_price": 0}, {"name": "Large", "extra_price": 5000}], "sweetness": ["Normal (100%)", "Less Sweet (50%)", "No Sugar (0%)"], "ice": ["Normal Ice", "Less Ice", "No Ice"], "milk_options": [{"name": "Fresh Milk", "extra_price": 0}, {"name": "Oat Milk", "extra_price": 8000}]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. TABLES (SEATING) TABLE
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    area VARCHAR(50) DEFAULT 'main_hall', -- 'tatami', 'main_hall', 'garden_terrace', 'bar_counter'
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. BOOKINGS (RESERVATIONS) TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(100),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guest_count INT NOT NULL DEFAULT 2,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    table_name VARCHAR(100),
    area_preference VARCHAR(50),
    notes TEXT,
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected', 'completed', 'cancelled'
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Unique index to prevent double bookings on the same table, date, and time slot!
CREATE UNIQUE INDEX IF NOT EXISTS idx_no_double_booking 
ON bookings (table_id, booking_date, booking_time) 
WHERE status IN ('pending', 'confirmed');

-- 8. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100),
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(12,2) DEFAULT 0,
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    order_type VARCHAR(20) DEFAULT 'dine_in', -- 'dine_in', 'takeaway'
    table_number VARCHAR(20),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(100),
    notes TEXT,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    service_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(30) DEFAULT 'qris', -- 'qris', 'bank_transfer', 'cashier'
    payment_status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    quantity INT NOT NULL DEFAULT 1,
    options JSONB DEFAULT '{}'::jsonb,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(30) DEFAULT 'paid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    id_text TEXT NOT NULL,
    en_text TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE cafe_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Customers can read menus, cafe settings, tables)
CREATE POLICY "Public cafe settings read" ON cafe_settings FOR SELECT USING (true);
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products read" ON products FOR SELECT USING (true);
CREATE POLICY "Public tables read" ON tables FOR SELECT USING (true);
-- Private records are accessed server-side with the service role.
-- Orders, order items, customers and transactions are accessed server-side with the service role.

-- ADMIN FULL ACCESS POLICIES (when service role or authenticated admin)
CREATE POLICY "Admin full access cafe_settings" ON cafe_settings FOR ALL USING (true);
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access tables" ON tables FOR ALL USING (true);

-- A single function call writes the order and all dependent rows atomically.
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
