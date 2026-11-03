export type Language = 'id' | 'en';

export interface CafeSettings {
  id: string;
  name: string;
  kanji_name?: string;
  tagline: string;
  description: string;
  logo_url: string;
  banner_url: string;
  address: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  tiktok: string;
  maps_url: string;
  opening_hours: {
    weekdays: string;
    weekends: string;
  };
  primary_color: string;
  currency_symbol: string;
  tax_percentage: number;
  service_percentage: number;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string;
  description_en?: string;
  icon?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  price_adjustment: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  name_en?: string;
  slug: string;
  description: string;
  description_en?: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  is_popular: boolean;
  is_new?: boolean;
  stock: number;
  calories?: number;
  tags?: string[];
  variants?: {
    size?: { name: string; extra_price: number }[];
    sweetness?: string[];
    ice?: string[];
    milk_options?: { name: string; extra_price: number }[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: string;
  table_number: string;
  name: string;
  capacity: number;
  area: 'tatami' | 'main_hall' | 'garden_terrace' | 'bar_counter';
  is_active: boolean;
  description?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:mm
  guest_count: number;
  table_id?: string;
  table_name?: string;
  area_preference?: string;
  notes?: string;
  status: BookingStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'dine_in' | 'takeaway';
export type PaymentMethod = 'qris' | 'bank_transfer' | 'cashier';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface CartItem {
  product: Product;
  quantity: number;
  selected_size?: string;
  selected_sweetness?: string;
  selected_ice?: string;
  selected_milk?: string;
  custom_notes?: string;
  item_total: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  options?: {
    size?: string;
    sweetness?: string;
    ice?: string;
    milk?: string;
    notes?: string;
  };
  subtotal: number;
}

export interface Order {
  id: string;
  order_code: string;
  order_type: OrderType;
  table_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  service_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  total_orders: number;
  total_spent: number;
  last_visit: string;
}

export interface Transaction {
  id: string;
  transaction_code: string;
  order_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  created_at: string;
}

export interface ImageSearchResult {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  photographer?: string;
  source: string;
}

