/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return { __kind__: "Some", value };
}
function none(): None {
    return { __kind__: "None" };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) throw new Error("unwrap: none");
    return option.value;
}
function candid_some<T>(value: T): [T] { return [value]; }
function candid_none<T>(): [] { return []; }
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}

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
export type OrderStatus = { pending: null } | { completed: null } | { voided: null };
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

export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    getCallerUserRole(): Promise<{ admin: null } | { user: null } | { anonymous: null }>;
    assignCallerUserRole(user: Principal, role: { admin: null } | { user: null } | { anonymous: null }): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    createCategory(name: string, sortOrder: bigint): Promise<Category>;
    updateCategory(id: bigint, name: string, sortOrder: bigint): Promise<Option<Category>>;
    deleteCategory(id: bigint): Promise<boolean>;
    listCategories(): Promise<Category[]>;
    createMenuItem(categoryId: bigint, name: string, description: string, priceCents: bigint): Promise<MenuItem>;
    updateMenuItem(id: bigint, categoryId: bigint, name: string, description: string, priceCents: bigint, available: boolean): Promise<Option<MenuItem>>;
    deleteMenuItem(id: bigint): Promise<boolean>;
    listMenuItems(): Promise<MenuItem[]>;
    listMenuItemsByCategory(categoryId: bigint): Promise<MenuItem[]>;
    createOrder(customerName: string, customerMobile: string, items: CreateOrderItemInput[]): Promise<Option<Order>>;
    getOrder(id: bigint): Promise<Option<Order>>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<Option<Order>>;
    listRecentOrders(limit: bigint): Promise<Order[]>;
}

export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: any) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<any>, private processError?: (error: unknown) => never){}

    async _initializeAccessControlWithSecret(userSecret: string): Promise<void> {
        await this.actor._initializeAccessControlWithSecret(userSecret);
    }
    async getCallerUserRole(): Promise<{ admin: null } | { user: null } | { anonymous: null }> {
        return await this.actor.getCallerUserRole();
    }
    async assignCallerUserRole(user: Principal, role: { admin: null } | { user: null } | { anonymous: null }): Promise<void> {
        await this.actor.assignCallerUserRole(user, role);
    }
    async isCallerAdmin(): Promise<boolean> {
        return await this.actor.isCallerAdmin();
    }
    async createCategory(name: string, sortOrder: bigint): Promise<Category> {
        const r = await this.actor.createCategory(name, sortOrder);
        return r;
    }
    async updateCategory(id: bigint, name: string, sortOrder: bigint): Promise<Option<Category>> {
        const r = await this.actor.updateCategory(id, name, sortOrder);
        return r.length > 0 ? some(r[0]) : none();
    }
    async deleteCategory(id: bigint): Promise<boolean> {
        return await this.actor.deleteCategory(id);
    }
    async listCategories(): Promise<Category[]> {
        return await this.actor.listCategories();
    }
    async createMenuItem(categoryId: bigint, name: string, description: string, priceCents: bigint): Promise<MenuItem> {
        return await this.actor.createMenuItem(categoryId, name, description, priceCents);
    }
    async updateMenuItem(id: bigint, categoryId: bigint, name: string, description: string, priceCents: bigint, available: boolean): Promise<Option<MenuItem>> {
        const r = await this.actor.updateMenuItem(id, categoryId, name, description, priceCents, available);
        return r.length > 0 ? some(r[0]) : none();
    }
    async deleteMenuItem(id: bigint): Promise<boolean> {
        return await this.actor.deleteMenuItem(id);
    }
    async listMenuItems(): Promise<MenuItem[]> {
        return await this.actor.listMenuItems();
    }
    async listMenuItemsByCategory(categoryId: bigint): Promise<MenuItem[]> {
        return await this.actor.listMenuItemsByCategory(categoryId);
    }
    async createOrder(customerName: string, customerMobile: string, items: CreateOrderItemInput[]): Promise<Option<Order>> {
        const r = await this.actor.createOrder(customerName, customerMobile, items);
        return r.length > 0 ? some(r[0]) : none();
    }
    async getOrder(id: bigint): Promise<Option<Order>> {
        const r = await this.actor.getOrder(id);
        return r.length > 0 ? some(r[0]) : none();
    }
    async updateOrderStatus(id: bigint, status: OrderStatus): Promise<Option<Order>> {
        const r = await this.actor.updateOrderStatus(id, status);
        return r.length > 0 ? some(r[0]) : none();
    }
    async listRecentOrders(limit: bigint): Promise<Order[]> {
        return await this.actor.listRecentOrders(limit);
    }
}

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) this._blob = blob;
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) return this._blob;
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string { return this.directURL; }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, { agent, canisterId, ...options.actorOptions });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
