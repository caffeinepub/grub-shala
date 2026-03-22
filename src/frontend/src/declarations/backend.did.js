/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

const Category = IDL.Record({ id: IDL.Nat, name: IDL.Text, sortOrder: IDL.Nat });
const MenuItem = IDL.Record({ id: IDL.Nat, categoryId: IDL.Nat, name: IDL.Text, description: IDL.Text, priceCents: IDL.Nat, available: IDL.Bool });
const OrderStatus = IDL.Variant({ pending: IDL.Null, completed: IDL.Null, voided: IDL.Null });
const OrderItem = IDL.Record({ menuItemId: IDL.Nat, name: IDL.Text, priceCents: IDL.Nat, quantity: IDL.Nat });
const Order = IDL.Record({ id: IDL.Nat, orderNumber: IDL.Nat, customerName: IDL.Text, customerMobile: IDL.Text, items: IDL.Vec(OrderItem), subtotalCents: IDL.Nat, taxCents: IDL.Nat, totalCents: IDL.Nat, status: OrderStatus, createdAt: IDL.Int });
const CreateOrderItemInput = IDL.Record({ menuItemId: IDL.Nat, quantity: IDL.Nat });
const UserRole = IDL.Variant({ admin: IDL.Null, user: IDL.Null, anonymous: IDL.Null });

export const idlService = IDL.Service({
  _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
  getCallerUserRole: IDL.Func([], [UserRole], ['query']),
  assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
  isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
  createCategory: IDL.Func([IDL.Text, IDL.Nat], [Category], []),
  updateCategory: IDL.Func([IDL.Nat, IDL.Text, IDL.Nat], [IDL.Opt(Category)], []),
  deleteCategory: IDL.Func([IDL.Nat], [IDL.Bool], []),
  listCategories: IDL.Func([], [IDL.Vec(Category)], ['query']),
  createMenuItem: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Nat], [MenuItem], []),
  updateMenuItem: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text, IDL.Text, IDL.Nat, IDL.Bool], [IDL.Opt(MenuItem)], []),
  deleteMenuItem: IDL.Func([IDL.Nat], [IDL.Bool], []),
  listMenuItems: IDL.Func([], [IDL.Vec(MenuItem)], ['query']),
  listMenuItemsByCategory: IDL.Func([IDL.Nat], [IDL.Vec(MenuItem)], ['query']),
  createOrder: IDL.Func([IDL.Text, IDL.Text, IDL.Vec(CreateOrderItemInput)], [IDL.Opt(Order)], []),
  getOrder: IDL.Func([IDL.Nat], [IDL.Opt(Order)], ['query']),
  updateOrderStatus: IDL.Func([IDL.Nat, OrderStatus], [IDL.Opt(Order)], []),
  listRecentOrders: IDL.Func([IDL.Nat], [IDL.Vec(Order)], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({ id: IDL.Nat, name: IDL.Text, sortOrder: IDL.Nat });
  const MenuItem = IDL.Record({ id: IDL.Nat, categoryId: IDL.Nat, name: IDL.Text, description: IDL.Text, priceCents: IDL.Nat, available: IDL.Bool });
  const OrderStatus = IDL.Variant({ pending: IDL.Null, completed: IDL.Null, voided: IDL.Null });
  const OrderItem = IDL.Record({ menuItemId: IDL.Nat, name: IDL.Text, priceCents: IDL.Nat, quantity: IDL.Nat });
  const Order = IDL.Record({ id: IDL.Nat, orderNumber: IDL.Nat, customerName: IDL.Text, customerMobile: IDL.Text, items: IDL.Vec(OrderItem), subtotalCents: IDL.Nat, taxCents: IDL.Nat, totalCents: IDL.Nat, status: OrderStatus, createdAt: IDL.Int });
  const CreateOrderItemInput = IDL.Record({ menuItemId: IDL.Nat, quantity: IDL.Nat });
  const UserRole = IDL.Variant({ admin: IDL.Null, user: IDL.Null, anonymous: IDL.Null });
  return IDL.Service({
    _initializeAccessControlWithSecret: IDL.Func([IDL.Text], [], []),
    getCallerUserRole: IDL.Func([], [UserRole], ['query']),
    assignCallerUserRole: IDL.Func([IDL.Principal, UserRole], [], []),
    isCallerAdmin: IDL.Func([], [IDL.Bool], ['query']),
    createCategory: IDL.Func([IDL.Text, IDL.Nat], [Category], []),
    updateCategory: IDL.Func([IDL.Nat, IDL.Text, IDL.Nat], [IDL.Opt(Category)], []),
    deleteCategory: IDL.Func([IDL.Nat], [IDL.Bool], []),
    listCategories: IDL.Func([], [IDL.Vec(Category)], ['query']),
    createMenuItem: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Nat], [MenuItem], []),
    updateMenuItem: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text, IDL.Text, IDL.Nat, IDL.Bool], [IDL.Opt(MenuItem)], []),
    deleteMenuItem: IDL.Func([IDL.Nat], [IDL.Bool], []),
    listMenuItems: IDL.Func([], [IDL.Vec(MenuItem)], ['query']),
    listMenuItemsByCategory: IDL.Func([IDL.Nat], [IDL.Vec(MenuItem)], ['query']),
    createOrder: IDL.Func([IDL.Text, IDL.Text, IDL.Vec(CreateOrderItemInput)], [IDL.Opt(Order)], []),
    getOrder: IDL.Func([IDL.Nat], [IDL.Opt(Order)], ['query']),
    updateOrderStatus: IDL.Func([IDL.Nat, OrderStatus], [IDL.Opt(Order)], []),
    listRecentOrders: IDL.Func([IDL.Nat], [IDL.Vec(Order)], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
