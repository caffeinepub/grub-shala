import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Category {
  id: bigint;
  name: string;
  sortOrder: bigint;
}

export interface MenuItem {
  id: bigint;
  categoryId: bigint;
  name: string;
  description: string;
  priceCents: bigint;
  available: boolean;
}

export interface OrderItem {
  menuItemId: bigint;
  name: string;
  priceCents: bigint;
  quantity: bigint;
}

export type OrderStatus =
  | { pending: null }
  | { completed: null }
  | { voided: null };

export interface Order {
  id: bigint;
  orderNumber: bigint;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  subtotalCents: bigint;
  taxCents: bigint;
  totalCents: bigint;
  status: OrderStatus;
  createdAt: bigint;
}

export interface CreateOrderItemInput {
  menuItemId: bigint;
  quantity: bigint;
}

export interface Outlet {
  id: bigint;
  name: string;
  address: string;
}

export interface backendInterface {
  // Authorization
  _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
  getCallerUserRole(): Promise<{ admin: null } | { user: null } | { anonymous: null }>;
  assignCallerUserRole(user: Principal, role: { admin: null } | { user: null } | { anonymous: null }): Promise<void>;
  isCallerAdmin(): Promise<boolean>;

  // Outlets
  createOutlet(name: string, address: string): Promise<Outlet>;
  updateOutlet(id: bigint, name: string, address: string): Promise<Option<Outlet>>;
  deleteOutlet(id: bigint): Promise<boolean>;
  listOutlets(): Promise<Outlet[]>;

  // Categories
  createCategory(name: string, sortOrder: bigint): Promise<Category>;
  updateCategory(id: bigint, name: string, sortOrder: bigint): Promise<Option<Category>>;
  deleteCategory(id: bigint): Promise<boolean>;
  listCategories(): Promise<Category[]>;

  // Menu Items
  createMenuItem(categoryId: bigint, name: string, description: string, priceCents: bigint): Promise<MenuItem>;
  updateMenuItem(id: bigint, categoryId: bigint, name: string, description: string, priceCents: bigint, available: boolean): Promise<Option<MenuItem>>;
  deleteMenuItem(id: bigint): Promise<boolean>;
  listMenuItems(): Promise<MenuItem[]>;
  listMenuItemsByCategory(categoryId: bigint): Promise<MenuItem[]>;

  // Orders
  createOrder(customerName: string, customerMobile: string, items: CreateOrderItemInput[], taxEnabled: boolean): Promise<Option<Order>>;
  getOrder(id: bigint): Promise<Option<Order>>;
  updateOrderStatus(id: bigint, status: OrderStatus): Promise<Option<Order>>;
  deleteOrder(id: bigint): Promise<boolean>;
  listRecentOrders(limit: bigint): Promise<Order[]>;
}
