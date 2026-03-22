import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  CreateOrderItemInput,
  MenuItem,
  Order,
  OrderStatus,
  Outlet,
  backendInterface,
} from "../backend.d";
import { useActor } from "./useActor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function typedActor(actor: any): backendInterface {
  return actor as backendInterface;
}

export function useListCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return typedActor(actor).listCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useListMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return typedActor(actor).listMenuItems();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useListRecentOrders(limit = 50n) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return typedActor(actor).listRecentOrders(limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return typedActor(actor).isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListOutlets() {
  const { actor, isFetching } = useActor();
  return useQuery<Outlet[]>({
    queryKey: ["outlets"],
    queryFn: async () => {
      if (!actor) return [];
      return typedActor(actor).listOutlets();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreateOutlet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      address,
    }: { name: string; address: string }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).createOutlet(name, address);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outlets"] }),
  });
}

export function useUpdateOutlet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      address,
    }: { id: bigint; name: string; address: string }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).updateOutlet(id, name, address);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outlets"] }),
  });
}

export function useDeleteOutlet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).deleteOutlet(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["outlets"] }),
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      customerMobile,
      items,
      taxEnabled,
    }: {
      customerName: string;
      customerMobile: string;
      items: CreateOrderItemInput[];
      taxEnabled: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await typedActor(actor).createOrder(
        customerName,
        customerMobile,
        items,
        taxEnabled,
      );
      if (result.__kind__ === "None") throw new Error("Order creation failed");
      return result.value;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).deleteOrder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      sortOrder,
    }: { name: string; sortOrder: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).createCategory(name, sortOrder);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      sortOrder,
    }: { id: bigint; name: string; sortOrder: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).updateCategory(id, name, sortOrder);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).deleteCategory(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useCreateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      name,
      description,
      priceCents,
    }: {
      categoryId: bigint;
      name: string;
      description: string;
      priceCents: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).createMenuItem(
        categoryId,
        name,
        description,
        priceCents,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      categoryId,
      name,
      description,
      priceCents,
      available,
    }: {
      id: bigint;
      categoryId: bigint;
      name: string;
      description: string;
      priceCents: bigint;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).updateMenuItem(
        id,
        categoryId,
        name,
        description,
        priceCents,
        available,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).deleteMenuItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return typedActor(actor).updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
