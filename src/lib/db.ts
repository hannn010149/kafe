import fs from "fs";
import path from "path";
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

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories");

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    } catch (e) {
      console.warn("Supabase getCategories fallback:", e);
    }
  }
  return loadDB().categories.sort((a, b) => a.sort_order - b.sort_order);
}

export async function createCategory(cat: Omit<Category, "id">): Promise<Category> {
  const db = loadDB();
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    sort_order: cat.sort_order ?? db.categories.length + 1,
    is_active: cat.is_active ?? true,
  };
  db.categories.push(newCat);
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("categories").insert([newCat]);
    } catch (e) {
      console.warn("Supabase createCategory error:", e);
    }
  }
  revalidateTag("categories", { expire: 0 });
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const db = loadDB();
  const idx = db.categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.categories[idx] = { ...db.categories[idx], ...updates };
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("categories").update(updates).eq("id", id);
    } catch (e) {
      console.warn("Supabase updateCategory error:", e);
    }
  }
  revalidateTag("categories", { expire: 0 });
  return db.categories[idx];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = loadDB();
  const initLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length === initLen) return false;
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("categories").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase deleteCategory error:", e);
    }
  }
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

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      let query = supabaseAdmin.from("products").select("*");
      if (options?.category_id) query = query.eq("category_id", options.category_id);
      if (options?.onlyAvailable) query = query.eq("is_available", true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let prods = data as Product[];
        if (options?.query) {
          const q = options.query.toLowerCase();
          prods = prods.filter(
            (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
          );
        }
        return prods;
      }
    } catch (e) {
      console.warn("Supabase getProducts fallback:", e);
    }
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
  const db = loadDB();
  return db.products.find((p) => p.id === id || p.slug === id) || null;
}

export async function createProduct(prod: Omit<Product, "id">): Promise<Product> {
  const db = loadDB();
  const newProd: Product = {
    ...prod,
    id: `prod-${Date.now()}`,
    slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.products.unshift(newProd);
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("products").insert([newProd]);
    } catch (e) {
      console.warn("Supabase createProduct error:", e);
    }
  }
  revalidateTag("products", { expire: 0 });
  return newProd;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = loadDB();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = {
    ...db.products[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("products").update(updates).eq("id", id);
    } catch (e) {
      console.warn("Supabase updateProduct error:", e);
    }
  }
  revalidateTag("products", { expire: 0 });
  return db.products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = loadDB();
  const initLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length === initLen) return false;
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("products").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase deleteProduct error:", e);
    }
  }
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

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from("tables").select("*").order("table_number");
      if (!error && data && data.length > 0) return data as Table[];
    } catch (e) {
      console.warn("Supabase getTables fallback:", e);
    }
  }
  return loadDB().tables;
}

export async function createTable(t: Omit<Table, "id">): Promise<Table> {
  const db = loadDB();
  const newTable: Table = { ...t, id: `tbl-${Date.now()}` };
  db.tables.push(newTable);
  saveDB(db);
  revalidateTag("tables", { expire: 0 });
  return newTable;
}

export async function updateTable(id: string, updates: Partial<Table>): Promise<Table | null> {
  const db = loadDB();
  const idx = db.tables.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  db.tables[idx] = { ...db.tables[idx], ...updates };
  saveDB(db);
  revalidateTag("tables", { expire: 0 });
  return db.tables[idx];
}

export async function deleteTable(id: string): Promise<boolean> {
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
export async function checkTableAvailability(
  booking_date: string,
  booking_time: string,
  table_id?: string
): Promise<{ available: boolean; conflictWith?: Booking }> {
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
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Booking[];
    } catch (e) {
      console.warn("Supabase getBookings fallback:", e);
    }
  }
  return [...loadDB().bookings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getBookingByCode(code: string): Promise<Booking | null> {
  const db = loadDB();
  return db.bookings.find((b) => b.booking_code.toLowerCase() === code.toLowerCase()) || null;
}

export async function createBooking(data: Omit<Booking, "id" | "booking_code" | "status" | "created_at">): Promise<Booking> {
  const db = loadDB();
  
  // Enforce double booking check
  if (data.table_id) {
    const { available } = await checkTableAvailability(data.booking_date, data.booking_time, data.table_id);
    if (!available) {
      throw new Error("Meja ini sudah dipesan untuk jam tersebut. Silakan pilih meja atau jam lain.");
    }
  }

  // Generate unique booking code BKG-YYYYMMDD-XXXX
  const dateStr = data.booking_date.replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const booking_code = `BKG-${dateStr}-${randomSuffix}`;

  // Find table name if table_id provided
  let table_name = data.table_name;
  if (data.table_id && !table_name) {
    const table = db.tables.find((t) => t.id === data.table_id);
    if (table) table_name = `${table.table_number} - ${table.name}`;
  }

  const newBooking: Booking = {
    ...data,
    id: `bk-${Date.now()}`,
    booking_code,
    table_name,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking);
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("bookings").insert([newBooking]);
    } catch (e) {
      console.warn("Supabase createBooking error:", e);
    }
  }
  return newBooking;
}

export async function updateBookingStatus(id: string, status: BookingStatus, rejection_reason?: string): Promise<Booking | null> {
  const db = loadDB();
  const idx = db.bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  db.bookings[idx].status = status;
  if (rejection_reason) {
    db.bookings[idx].rejection_reason = rejection_reason;
  }
  db.bookings[idx].updated_at = new Date().toISOString();
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("bookings").update({ status, rejection_reason, updated_at: new Date().toISOString() }).eq("id", id);
    } catch (e) {
      console.warn("Supabase updateBookingStatus error:", e);
    }
  }
  return db.bookings[idx];
}

// -------------------------------------------------------------
// ORDERS & TRANSACTIONS
// -------------------------------------------------------------
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Order[];
    } catch (e) {
      console.warn("Supabase getOrders fallback:", e);
    }
  }
  return [...loadDB().orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const db = loadDB();
  const query = code.toLowerCase().trim();
  return (
    db.orders.find(
      (o) =>
        o.order_code.toLowerCase() === query ||
        o.customer_phone.includes(query) ||
        o.id === query
    ) || null
  );
}

export async function createOrder(data: {
  order_type: "dine_in" | "takeaway";
  table_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  items: Order["items"];
  subtotal: number;
  tax_amount: number;
  service_amount: number;
  total_amount: number;
  payment_method: Order["payment_method"];
}): Promise<Order> {
  const db = loadDB();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const order_code = `ORD-${dateStr}-${randomSuffix}`;

  const newOrder: Order = {
    ...data,
    id: `ord-${Date.now()}`,
    order_code,
    payment_status: data.payment_method === "cashier" ? "pending" : "paid",
    status: "confirmed",
    created_at: now.toISOString(),
  };

  db.orders.unshift(newOrder);

  // Record transaction
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    transaction_code: `TRX-${dateStr}-${randomSuffix}`,
    order_id: newOrder.id,
    amount: newOrder.total_amount,
    payment_method: newOrder.payment_method,
    status: newOrder.payment_status,
    created_at: now.toISOString(),
  };
  db.transactions.unshift(newTx);

  // Update or record customer
  const custIdx = db.customers.findIndex((c) => c.phone === data.customer_phone);
  if (custIdx > -1) {
    db.customers[custIdx].total_orders += 1;
    db.customers[custIdx].total_spent += data.total_amount;
    db.customers[custIdx].last_visit = now.toISOString().slice(0, 10);
  } else {
    db.customers.push({
      id: `cust-${Date.now()}`,
      name: data.customer_name,
      phone: data.customer_phone,
      email: data.customer_email,
      total_orders: 1,
      total_spent: data.total_amount,
      last_visit: now.toISOString().slice(0, 10),
    });
  }

  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("orders").insert([newOrder]);
    } catch (e) {
      console.warn("Supabase createOrder error:", e);
    }
  }
  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const db = loadDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  db.orders[idx].status = status;
  if (status === "completed") {
    db.orders[idx].payment_status = "paid";
  }
  db.orders[idx].updated_at = new Date().toISOString();
  saveDB(db);

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    } catch (e) {
      console.warn("Supabase updateOrderStatus error:", e);
    }
  }
  return db.orders[idx];
}

// -------------------------------------------------------------
// CUSTOMERS & TRANSACTIONS
// -------------------------------------------------------------
export async function getCustomers(): Promise<Customer[]> {
  return loadDB().customers;
}

export async function getTransactions(): Promise<Transaction[]> {
  return loadDB().transactions;
}

// -------------------------------------------------------------
// REPORTS & ANALYTICS
// -------------------------------------------------------------
export async function getReportsData() {
  const db = loadDB();
  const orders = db.orders;
  const bookings = db.bookings;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total_amount : 0), 0);
  const totalOrders = orders.length;
  const totalBookings = bookings.length;
  const totalCustomers = db.customers.length;

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
