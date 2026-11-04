import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import {
  CafeSettings,
  Category,
  Product,
  Table,
  Booking,
  Order,
  Customer,
  Transaction,
  BookingStatus,
  OrderStatus,
} from "@/types";
import {
  initialCafeSettings,
  initialCategories,
  initialProducts,
  initialTables,
  initialBookings,
  initialOrders,
  initialCustomers,
  initialTransactions,
} from "./seed-data";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";

interface LocalDatabase {
  cafe_settings: CafeSettings;
  categories: Category[];
  products: Product[];
  tables: Table[];
  bookings: Booking[];
  orders: Order[];
  customers: Customer[];
  transactions: Transaction[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function getInitialDB(): LocalDatabase {
  return {
    cafe_settings: { ...initialCafeSettings },
    categories: [...initialCategories],
    products: [...initialProducts],
    tables: [...initialTables],
    bookings: [...initialBookings],
    orders: [...initialOrders],
    customers: [...initialCustomers],
    transactions: [...initialTransactions],
  };
}

let inMemoryDB: LocalDatabase | null = null;

function loadDB(): LocalDatabase {
  if (inMemoryDB) return inMemoryDB;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      inMemoryDB = JSON.parse(content);
      return inMemoryDB!;
    }
  } catch (err) {
    console.warn("Could not read local DB file, using seed data:", err);
  }

  inMemoryDB = getInitialDB();
  saveDB(inMemoryDB);
  return inMemoryDB;
}

function saveDB(db: LocalDatabase) {
  inMemoryDB = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write local DB file:", err);
  }
}

// -------------------------------------------------------------
// CAFE SETTINGS
// -------------------------------------------------------------
export async function getCafeSettings(): Promise<CafeSettings> {
  "use cache";
  cacheLife("minutes");
  cacheTag("cafe-settings");

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from("cafe_settings").select("*").single();
      if (!error && data) return data as CafeSettings;
    } catch (e) {
      console.warn("Supabase getCafeSettings fallback:", e);
    }
  }
  return loadDB().cafe_settings;
}

export async function updateCafeSettings(updated: Partial<CafeSettings>): Promise<CafeSettings> {
  const db = loadDB();
  db.cafe_settings = {
    ...db.cafe_settings,
    ...updated,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("cafe_settings").upsert(db.cafe_settings);
    } catch (e) {
      console.warn("Supabase updateCafeSettings error:", e);
    }
  }
  revalidateTag("cafe-settings", { expire: 0 });
  return db.cafe_settings;
}

export async function importSeedCatalog(): Promise<{
  categoriesInserted: number;
  categoriesSkipped: number;
  productsInserted: number;
  productsSkipped: number;
}> {
  if (!supabaseAdmin) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const categoryRows = initialCategories.map((category) => ({
    name: category.name,
    name_en: category.name_en,
    slug: category.slug,
    description: category.description,
    description_en: category.description_en,
    icon: category.icon,
    image_url: category.image_url,
    sort_order: category.sort_order,
    is_active: category.is_active,
  }));
  const { data: insertedCategories, error: categoryInsertError } = await supabaseAdmin
    .from("categories")
    .upsert(categoryRows, { onConflict: "slug", ignoreDuplicates: true })
    .select("slug");
  if (categoryInsertError) {
    throw new Error(`Supabase import categories failed: ${categoryInsertError.message}`);
  }

  const { data: categoryRecords, error: categoryLookupError } = await supabaseAdmin
    .from("categories")
    .select("id, slug")
    .in("slug", initialCategories.map((category) => category.slug));
  if (categoryLookupError) {
    throw new Error(`Supabase lookup categories failed: ${categoryLookupError.message}`);
  }
  const categoryIdBySlug = new Map((categoryRecords ?? []).map((category) => [category.slug, category.id]));
  const categoryIdBySeedId = new Map(
    initialCategories.map((category) => [category.id, categoryIdBySlug.get(category.slug)])
  );

  const productRows = initialProducts.map((product) => {
    const categoryId = categoryIdBySeedId.get(product.category_id);
    if (!categoryId) {
      throw new Error(`Kategori seed untuk produk "${product.slug}" tidak ditemukan di Supabase.`);
    }

    return {
      category_id: categoryId,
      name: product.name,
      name_en: product.name_en,
      slug: product.slug,
      description: product.description,
      description_en: product.description_en,
      price: product.price,
      image_url: product.image_url,
      is_available: product.is_available,
      is_featured: product.is_featured,
      is_popular: product.is_popular,
      is_new: product.is_new,
      stock: product.stock,
      calories: product.calories,
      tags: product.tags,
      variants: product.variants,
    };
  });
  const { data: insertedProducts, error: productInsertError } = await supabaseAdmin
    .from("products")
    .upsert(productRows, { onConflict: "slug", ignoreDuplicates: true })
    .select("slug");
  if (productInsertError) {
    throw new Error(`Supabase import products failed: ${productInsertError.message}`);
  }

  const categoriesInserted = insertedCategories?.length ?? 0;
  const productsInserted = insertedProducts?.length ?? 0;
  revalidateTag("categories", { expire: 0 });
  revalidateTag("products", { expire: 0 });

  return {
    categoriesInserted,
    categoriesSkipped: initialCategories.length - categoriesInserted,
    productsInserted,
    productsSkipped: initialProducts.length - productsInserted,
  };
}

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories");

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(`Supabase getCategories failed: ${error.message}`);
    return (data ?? []) as Category[];
  }
  return loadDB().categories.sort((a, b) => a.sort_order - b.sort_order);
}

export async function createCategory(cat: Omit<Category, "id">): Promise<Category> {
  if (supabaseAdmin) {
    const categoryData = {
      name: cat.name,
      name_en: cat.name_en,
      slug: cat.slug,
      description: cat.description,
      description_en: cat.description_en,
      icon: cat.icon,
      image_url: cat.image_url,
      sort_order: cat.sort_order ?? 0,
      is_active: cat.is_active ?? true,
    };
    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([categoryData])
      .select("*")
      .single();
    if (error) throw new Error(`Supabase createCategory failed: ${error.message}`);
    revalidateTag("categories", { expire: 0 });
    return data as Category;
  }

  const db = loadDB();
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    sort_order: cat.sort_order ?? db.categories.length + 1,
    is_active: cat.is_active ?? true,
  };
  db.categories.push(newCat);
  saveDB(db);
  revalidateTag("categories", { expire: 0 });
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  if (supabaseAdmin) {
    const categoryUpdates = { ...updates };
    delete categoryUpdates.id;
    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(categoryUpdates)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`Supabase updateCategory failed: ${error.message}`);
    if (data) revalidateTag("categories", { expire: 0 });
    return data as Category | null;
  }

  const db = loadDB();
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.categories[idx] = { ...db.categories[idx], ...updates };
  saveDB(db);
  revalidateTag("categories", { expire: 0 });
  return db.categories[idx];
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`Supabase deleteCategory failed: ${error.message}`);
    if (data) revalidateTag("categories", { expire: 0 });
    return Boolean(data);
  }

  const db = loadDB();
  const initLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length === initLen) return false;
  saveDB(db);
  revalidateTag("categories", { expire: 0 });
  return true;
}

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------
export async function getProducts(options?: { category_id?: string; query?: string; onlyAvailable?: boolean }): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  if (supabaseAdmin) {
    let query = supabaseAdmin.from("products").select("*");
    if (options?.category_id && options.category_id !== "all") {
      query = query.eq("category_id", options.category_id);
    }
    if (options?.onlyAvailable) query = query.eq("is_available", true);
    const { data, error } = await query;
    if (error) throw new Error(`Supabase getProducts failed: ${error.message}`);
    let prods = (data ?? []) as Product[];
    if (options?.query) {
      const q = options.query.toLowerCase();
      prods = prods.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return prods;
  }

  let prods = [...loadDB().products];
  if (options?.category_id && options.category_id !== "all") {
    prods = prods.filter((p) => p.category_id === options.category_id);
  }
  if (options?.onlyAvailable) {
    prods = prods.filter((p) => p.is_available);
  }
  if (options?.query) {
    const q = options.query.toLowerCase();
    prods = prods.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
    );
  }
  return prods;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (supabaseAdmin) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq(isUuid ? "id" : "slug", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase getProductById failed: ${error.message}`);
    return data as Product | null;
  }

  const db = loadDB();
  return db.products.find((p) => p.id === id || p.slug === id) || null;
}

export async function createProduct(prod: Omit<Product, "id">): Promise<Product> {
  const slug = prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (supabaseAdmin) {
    const productData = {
      category_id: prod.category_id,
      name: prod.name,
      name_en: prod.name_en,
      slug,
      description: prod.description,
      description_en: prod.description_en,
      price: prod.price,
      image_url: prod.image_url,
      is_available: prod.is_available,
      is_featured: prod.is_featured,
      is_popular: prod.is_popular,
      is_new: prod.is_new,
      stock: prod.stock,
      calories: prod.calories,
      tags: prod.tags,
      variants: prod.variants,
    };
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([productData])
      .select("*")
      .single();
    if (error) throw new Error(`Supabase createProduct failed: ${error.message}`);
    revalidateTag("products", { expire: 0 });
    return data as Product;
  }

  const db = loadDB();
  const newProd: Product = {
    ...prod,
    id: `prod-${Date.now()}`,
    slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.products.unshift(newProd);
  saveDB(db);
  revalidateTag("products", { expire: 0 });
  return newProd;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (supabaseAdmin) {
    const productUpdates = { ...updates };
    delete productUpdates.id;
    delete productUpdates.created_at;
    const { data, error } = await supabaseAdmin
      .from("products")
      .update({ ...productUpdates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`Supabase updateProduct failed: ${error.message}`);
    if (data) revalidateTag("products", { expire: 0 });
    return data as Product | null;
  }

  const db = loadDB();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = {
    ...db.products[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);
  revalidateTag("products", { expire: 0 });
  return db.products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`Supabase deleteProduct failed: ${error.message}`);
    if (data) revalidateTag("products", { expire: 0 });
    return Boolean(data);
  }

  const db = loadDB();
  const initLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initLen) return false;
  saveDB(db);
  revalidateTag("products", { expire: 0 });
  return true;
}

// -------------------------------------------------------------
// TABLES
// -------------------------------------------------------------
export async function getTables(): Promise<Table[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("tables");

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from("tables").select("*").order("table_number");
    if (error) throw new Error(`Supabase getTables failed: ${error.message}`);
    return (data ?? []) as Table[];
  }
  return loadDB().tables;
}

export async function createTable(t: Omit<Table, "id">): Promise<Table> {
  if (supabaseAdmin) {
    const tableData = {
      table_number: t.table_number,
      name: t.name,
      capacity: t.capacity,
      area: t.area,
      is_active: t.is_active,
      description: t.description,
    };
    const { data, error } = await supabaseAdmin
      .from("tables")
      .insert([tableData])
      .select("*")
      .single();
    if (error) throw new Error(`Supabase createTable failed: ${error.message}`);
    revalidateTag("tables", { expire: 0 });
    return data as Table;
  }

  const db = loadDB();
  const newTable: Table = { ...t, id: `tbl-${Date.now()}` };
  db.tables.push(newTable);
  saveDB(db);
  revalidateTag("tables", { expire: 0 });
  return newTable;
}

export async function updateTable(id: string, updates: Partial<Table>): Promise<Table | null> {
  if (supabaseAdmin) {
    const tableUpdates = { ...updates };
    delete tableUpdates.id;
    const { data, error } = await supabaseAdmin
      .from("tables")
      .update(tableUpdates)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`Supabase updateTable failed: ${error.message}`);
    if (data) revalidateTag("tables", { expire: 0 });
    return data as Table | null;
  }

  const db = loadDB();
  const idx = db.tables.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  db.tables[idx] = { ...db.tables[idx], ...updates };
  saveDB(db);
  revalidateTag("tables", { expire: 0 });
  return db.tables[idx];
}

export async function deleteTable(id: string): Promise<boolean> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("tables")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(`Supabase deleteTable failed: ${error.message}`);
    if (data) revalidateTag("tables", { expire: 0 });
    return Boolean(data);
  }

  const db = loadDB();
  const initial = db.tables.length;
  db.tables = db.tables.filter((t) => t.id !== id);
  if (db.tables.length === initial) return false;
  saveDB(db);
  revalidateTag("tables", { expire: 0 });
  return true;
}

// -------------------------------------------------------------
// BOOKINGS & DOUBLE-BOOKING PREVENTION
// -------------------------------------------------------------
function normalizeBookingTime(booking: Booking): Booking {
  return { ...booking, booking_time: booking.booking_time.slice(0, 5) };
}

export async function checkTableAvailability(
  booking_date: string,
  booking_time: string,
  table_id?: string
): Promise<{ available: boolean; conflictWith?: Booking }> {
  if (supabaseAdmin) {
    if (!table_id) return { available: true };
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("booking_date", booking_date)
      .eq("table_id", table_id)
      .not("status", "in", '("rejected","cancelled")');
    if (error) throw new Error(`Supabase checkTableAvailability failed: ${error.message}`);
    const [targetH, targetM] = booking_time.split(":").map(Number);
    const targetMins = targetH * 60 + targetM;
    const conflict = (data ?? []).find((row) => {
      const [existingH, existingM] = String(row.booking_time).split(":").map(Number);
      return Math.abs(existingH * 60 + existingM - targetMins) < 90;
    });
    return {
      available: !conflict,
      conflictWith: conflict as Booking | undefined,
    };
  }

  const db = loadDB();
  
  // Find if there's an active booking on this exact date and time
  const conflict = db.bookings.find((b) => {
    if (b.status === "rejected" || b.status === "cancelled") return false;
    if (b.booking_date !== booking_date) return false;
    
    // Check time slot collision (within 90 minutes of existing booking)
    const [existingH, existingM] = b.booking_time.split(":").map(Number);
    const [targetH, targetM] = booking_time.split(":").map(Number);
    const existingMins = existingH * 60 + existingM;
    const targetMins = targetH * 60 + targetM;
    const isOverlapping = Math.abs(existingMins - targetMins) < 90;

    if (!isOverlapping) return false;

    // If specific table selected, conflict if same table
    if (table_id && b.table_id === table_id) {
      return true;
    }
    return false;
  });

  return {
    available: !conflict,
    conflictWith: conflict,
  };
}

export async function getBookings(): Promise<Booking[]> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase getBookings failed: ${error.message}`);
    return ((data ?? []) as Booking[]).map(normalizeBookingTime);
  }
  return [...loadDB().bookings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getBookingByCode(code: string): Promise<Booking | null> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .ilike("booking_code", code)
      .maybeSingle();
    if (error) throw new Error(`Supabase getBookingByCode failed: ${error.message}`);
    return data ? normalizeBookingTime(data as Booking) : null;
  }

  const db = loadDB();
  return db.bookings.find((b) => b.booking_code.toLowerCase() === code.toLowerCase()) || null;
}

export async function createBooking(data: Omit<Booking, "id" | "booking_code" | "status" | "created_at">): Promise<Booking> {
  // Enforce double booking check
  if (data.table_id) {
    const { available } = await checkTableAvailability(data.booking_date, data.booking_time, data.table_id);
    if (!available) {
      throw new Error("Meja ini sudah dipesan untuk jam tersebut. Silakan pilih meja atau jam lain.");
    }
  }

  // Supabase generates the UUID id; this public code identifies the booking.
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const booking_code = `bk-${Date.now()}-${randomSuffix}`;

  // Find table name if table_id provided
  let table_name = data.table_name;
  if (data.table_id && !table_name) {
    const tables = await getTables();
    const table = tables.find((t) => t.id === data.table_id);
    if (table) table_name = `${table.table_number} - ${table.name}`;
  }

  const bookingData: Omit<Booking, "id" | "created_at" | "updated_at"> = {
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_email: data.customer_email,
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    guest_count: data.guest_count,
    table_id: data.table_id,
    booking_code,
    table_name,
    area_preference: data.area_preference,
    notes: data.notes,
    status: "pending",
    rejection_reason: data.rejection_reason,
  };

  if (supabaseAdmin) {
    const { data: createdBooking, error } = await supabaseAdmin
      .from("bookings")
      .insert([bookingData])
      .select("*")
      .single();
    if (error) throw new Error(`Supabase createBooking failed: ${error.message}`);
    return normalizeBookingTime(createdBooking as Booking);
  }

  const db = loadDB();
  const newBooking: Booking = {
    ...bookingData,
    id: `bk-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  db.bookings.unshift(newBooking);
  saveDB(db);
  return newBooking;
}

export async function updateBooking(bookingCode: string, updates: Partial<Booking>): Promise<Booking | null> {
  const bookingUpdates = { ...updates };
  delete bookingUpdates.id;
  delete bookingUpdates.booking_code;
  delete bookingUpdates.created_at;
  const updatedAt = new Date().toISOString();

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .update({ ...bookingUpdates, updated_at: updatedAt })
      .eq("booking_code", bookingCode)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(`Supabase updateBooking failed: ${error.message}`);
    return data ? normalizeBookingTime(data as Booking) : null;
  }

  const db = loadDB();
  const idx = db.bookings.findIndex((b) => b.booking_code.toLowerCase() === bookingCode.toLowerCase());
  if (idx === -1) return null;

  db.bookings[idx] = { ...db.bookings[idx], ...bookingUpdates, updated_at: updatedAt };
  saveDB(db);
  return db.bookings[idx];
}

export async function updateBookingStatus(
  bookingCode: string,
  status: BookingStatus,
  rejection_reason?: string
): Promise<Booking | null> {
  return updateBooking(bookingCode, { status, rejection_reason });
}

export async function deleteBooking(bookingCode: string): Promise<boolean> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("booking_code", bookingCode)
      .select("booking_code")
      .maybeSingle();
    if (error) throw new Error(`Supabase deleteBooking failed: ${error.message}`);
    return Boolean(data);
  }

  const db = loadDB();
  const initialLength = db.bookings.length;
  db.bookings = db.bookings.filter(
    (booking) => booking.booking_code.toLowerCase() !== bookingCode.toLowerCase()
  );
  if (db.bookings.length === initialLength) return false;
  saveDB(db);
  return true;
}

// -------------------------------------------------------------
// ORDERS & TRANSACTIONS
// -------------------------------------------------------------
export interface CreateOrderInput {
  order_type: "dine_in" | "takeaway";
  table_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  items: Array<{
    product_id: string | null;
    product_name: string;
    product_image?: string;
    price: number;
    quantity: number;
    options?: Order["items"][number]["options"];
    subtotal: number;
  }>;
  subtotal: number;
  tax_amount: number;
  service_amount: number;
  total_amount: number;
  payment_method: Order["payment_method"];
}

export class OrderStorageError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 503
  ) {
    super(message);
    this.name = "OrderStorageError";
  }
}

function requireSupabaseOrderStore() {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    throw new OrderStorageError("Penyimpanan pesanan belum tersedia. Silakan coba lagi nanti.");
  }
  return supabaseAdmin;
}

function mapSupabaseOrder(row: Record<string, unknown>): Order {
  const { order_items, ...order } = row;
  return {
    ...order,
    items: Array.isArray(order_items) ? order_items : [],
  } as Order;
}

export async function getOrders(): Promise<Order[]> {
  const client = requireSupabaseOrderStore();
  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase getOrders failed:", error.code);
    throw new OrderStorageError("Gagal memuat pesanan dari database.");
  }
  return (data ?? []).map((row) => mapSupabaseOrder(row as Record<string, unknown>));
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const client = requireSupabaseOrderStore();
  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_code", code.trim().toUpperCase())
    .maybeSingle();
  if (error) {
    console.error("Supabase getOrderByCode failed:", error.code);
    throw new OrderStorageError("Gagal memuat status pesanan.");
  }
  return data ? mapSupabaseOrder(data as Record<string, unknown>) : null;
}

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const client = requireSupabaseOrderStore();
  const validOrderTypes = ["dine_in", "takeaway"];
  const validPaymentMethods = ["qris", "bank_transfer", "cashier"];
  const amounts = [data.subtotal, data.tax_amount, data.service_amount, data.total_amount];
  if (
    !data.customer_name?.trim() ||
    !data.customer_phone?.trim() ||
    (data.table_number !== undefined && typeof data.table_number !== "string") ||
    (data.customer_email !== undefined && typeof data.customer_email !== "string") ||
    (data.notes !== undefined && typeof data.notes !== "string") ||
    !validOrderTypes.includes(data.order_type) ||
    !validPaymentMethods.includes(data.payment_method) ||
    !Array.isArray(data.items) ||
    data.items.length === 0 ||
    amounts.some((amount) => !Number.isFinite(amount) || amount < 0) ||
    data.items.some((item) =>
      !item.product_name?.trim() ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isFinite(item.subtotal) ||
      item.subtotal < 0
    )
  ) {
    throw new OrderStorageError("Data pesanan tidak valid. Periksa kembali keranjang dan informasi pemesan.", 400);
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  const order_code = `ORD-${dateStr}-${suffix}`;
  const payment_status = data.payment_method === "cashier" ? "pending" : "paid";
  const order = {
    order_code,
    order_type: data.order_type,
    table_number: data.order_type === "dine_in" ? data.table_number || null : null,
    customer_name: data.customer_name.trim(),
    customer_phone: data.customer_phone.trim(),
    customer_email: data.customer_email?.trim() || null,
    notes: data.notes?.trim() || null,
    subtotal: data.subtotal,
    tax_amount: data.tax_amount,
    service_amount: data.service_amount,
    total_amount: data.total_amount,
    payment_method: data.payment_method,
    payment_status,
    status: "confirmed",
    created_at: now.toISOString(),
  };
  const items = data.items.map((item) => ({
    ...item,
    product_id: item.product_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.product_id)
      ? item.product_id
      : null,
  }));
  const transactionCode = `TRX-${dateStr}-${suffix}`;

  const { data: savedOrder, error } = await client.rpc("create_order_with_items", {
    p_order: order,
    p_items: items,
    p_transaction_code: transactionCode,
  });
  if (error) {
    console.error("Supabase createOrder failed:", error.code);
    throw new OrderStorageError("Pesanan gagal disimpan. Silakan coba kembali.");
  }
  if (!savedOrder || typeof savedOrder !== "object" || !Array.isArray(savedOrder.items)) {
    throw new OrderStorageError("Pesanan belum dapat diverifikasi tersimpan. Silakan hubungi kafe sebelum mencoba lagi.");
  }
  return savedOrder as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const validStatuses: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new OrderStorageError("Status pesanan tidak valid.", 400);
  }
  const client = requireSupabaseOrderStore();
  const { data, error } = await client.rpc("update_order_status", {
    p_order_id: id,
    p_status: status,
  });
  if (error) {
    console.error("Supabase updateOrderStatus failed:", error.code);
    throw new OrderStorageError("Status pesanan gagal diperbarui.");
  }
  if (data === null) return null;
  if (typeof data !== "object" || !Array.isArray(data.items)) {
    throw new OrderStorageError("Status pesanan belum dapat diverifikasi.");
  }
  return data as Order;
}

// -------------------------------------------------------------
// CUSTOMERS & TRANSACTIONS
// -------------------------------------------------------------
export async function getCustomers(): Promise<Customer[]> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .order("last_visit", { ascending: false });
    if (error) {
      console.error("Supabase getCustomers failed:", error.code);
      throw new OrderStorageError("Gagal memuat data pelanggan.");
    }
    return (data ?? []) as Customer[];
  }
  if (process.env.NODE_ENV === "production") {
    throw new OrderStorageError("Database pelanggan belum dikonfigurasi.");
  }
  return loadDB().customers;
}

export async function getTransactions(): Promise<Transaction[]> {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase getTransactions failed:", error.code);
      throw new OrderStorageError("Gagal memuat data transaksi.");
    }
    return (data ?? []) as Transaction[];
  }
  if (process.env.NODE_ENV === "production") {
    throw new OrderStorageError("Database transaksi belum dikonfigurasi.");
  }
  return loadDB().transactions;
}

// -------------------------------------------------------------
// REPORTS & ANALYTICS
// -------------------------------------------------------------
export async function getReportsData() {
  const [orders, bookings, customers] = await Promise.all([
    getOrders(),
    getBookings(),
    getCustomers(),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total_amount : 0), 0);
  const totalOrders = orders.length;
  const totalBookings = bookings.length;
  const totalCustomers = customers.length;

  // Best selling products calculation
  const productMap: Record<string, { name: string; count: number; revenue: number; image?: string }> = {};
  orders.forEach((ord) => {
    if (ord.status === "cancelled") return;
    ord.items.forEach((it) => {
      if (!productMap[it.product_name]) {
        productMap[it.product_name] = { name: it.product_name, count: 0, revenue: 0, image: it.product_image };
      }
      productMap[it.product_name].count += it.quantity;
      productMap[it.product_name].revenue += it.subtotal;
    });
  });

  const popularProducts = Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 6);

  // Monthly / Daily revenue breakdown
  const revenueByDay: Record<string, number> = {
    Senin: 850000,
    Selasa: 1120000,
    Rabu: 980000,
    Kamis: 1450000,
    Jumat: 2100000,
    Sabtu: 3850000,
    Minggu: 3200000,
  };

  return {
    totalRevenue,
    totalOrders,
    totalBookings,
    totalCustomers,
    popularProducts,
    revenueByDay,
    recentOrders: orders.slice(0, 5),
    recentBookings: bookings.slice(0, 5),
  };
}
