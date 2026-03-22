/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface _SERVICE {
  _initializeAccessControlWithSecret: ActorMethod<[string], void>;
  getCallerUserRole: ActorMethod<[], { admin: null } | { user: null } | { anonymous: null }>;
  assignCallerUserRole: ActorMethod<[Principal, { admin: null } | { user: null } | { anonymous: null }], void>;
  isCallerAdmin: ActorMethod<[], boolean>;
  createCategory: ActorMethod<[string, bigint], { id: bigint; name: string; sortOrder: bigint }>;
  updateCategory: ActorMethod<[bigint, string, bigint], [] | [{ id: bigint; name: string; sortOrder: bigint }]>;
  deleteCategory: ActorMethod<[bigint], boolean>;
  listCategories: ActorMethod<[], Array<{ id: bigint; name: string; sortOrder: bigint }>>;
  createMenuItem: ActorMethod<[bigint, string, string, bigint], { id: bigint; categoryId: bigint; name: string; description: string; priceCents: bigint; available: boolean }>;
  updateMenuItem: ActorMethod<[bigint, bigint, string, string, bigint, boolean], [] | [{ id: bigint; categoryId: bigint; name: string; description: string; priceCents: bigint; available: boolean }]>;
  deleteMenuItem: ActorMethod<[bigint], boolean>;
  listMenuItems: ActorMethod<[], Array<{ id: bigint; categoryId: bigint; name: string; description: string; priceCents: bigint; available: boolean }>>;
  listMenuItemsByCategory: ActorMethod<[bigint], Array<{ id: bigint; categoryId: bigint; name: string; description: string; priceCents: bigint; available: boolean }>>;
  createOrder: ActorMethod<[string, string, Array<{ menuItemId: bigint; quantity: bigint }>], [] | [{ id: bigint; orderNumber: bigint; customerName: string; customerMobile: string; items: Array<{ menuItemId: bigint; name: string; priceCents: bigint; quantity: bigint }>; subtotalCents: bigint; taxCents: bigint; totalCents: bigint; status: { pending: null } | { completed: null } | { voided: null }; createdAt: bigint }]>;
  getOrder: ActorMethod<[bigint], [] | [{ id: bigint; orderNumber: bigint; customerName: string; customerMobile: string; items: Array<{ menuItemId: bigint; name: string; priceCents: bigint; quantity: bigint }>; subtotalCents: bigint; taxCents: bigint; totalCents: bigint; status: { pending: null } | { completed: null } | { voided: null }; createdAt: bigint }]>;
  updateOrderStatus: ActorMethod<[bigint, { pending: null } | { completed: null } | { voided: null }], [] | [{ id: bigint; orderNumber: bigint; customerName: string; customerMobile: string; items: Array<{ menuItemId: bigint; name: string; priceCents: bigint; quantity: bigint }>; subtotalCents: bigint; taxCents: bigint; totalCents: bigint; status: { pending: null } | { completed: null } | { voided: null }; createdAt: bigint }]>;
  listRecentOrders: ActorMethod<[bigint], Array<{ id: bigint; orderNumber: bigint; customerName: string; customerMobile: string; items: Array<{ menuItemId: bigint; name: string; priceCents: bigint; quantity: bigint }>; subtotalCents: bigint; taxCents: bigint; totalCents: bigint; status: { pending: null } | { completed: null } | { voided: null }; createdAt: bigint }>>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
