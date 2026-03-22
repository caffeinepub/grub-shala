import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Download,
  KeyRound,
  Link2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  Category,
  MenuItem,
  Order,
  OrderStatus,
  Outlet,
} from "../backend.d";
import {
  ITEM_EMOJIS,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  formatPrice,
} from "../data/seedData";
import {
  useCreateCategory,
  useCreateMenuItem,
  useCreateOutlet,
  useDeleteCategory,
  useDeleteMenuItem,
  useDeleteOrder,
  useDeleteOutlet,
  useListCategories,
  useListMenuItems,
  useListOutlets,
  useListRecentOrders,
  useUpdateCategory,
  useUpdateMenuItem,
  useUpdateOrderStatus,
  useUpdateOutlet,
} from "../hooks/useQueries";

function getStatusLabel(status: OrderStatus): { label: string; color: string } {
  if ("pending" in status) return { label: "Pending", color: "text-pos-amber" };
  if ("completed" in status)
    return { label: "Completed", color: "text-primary" };
  if ("voided" in status) return { label: "Voided", color: "text-destructive" };
  return { label: "Unknown", color: "text-muted-foreground" };
}

function formatPrice2(cents: bigint): string {
  return formatPrice(cents);
}

function downloadCSV(filename: string, rows: string[][]): void {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatOrderDate(createdAt: bigint): string {
  const d = new Date(Number(createdAt) / 1_000_000);
  return `${d.toLocaleDateString("en-IN")} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
}

// ---- Outlets Tab ----
function OutletsTab() {
  const { data: outlets = [] } = useListOutlets();
  const createOutlet = useCreateOutlet();
  const updateOutlet = useUpdateOutlet();
  const deleteOutlet = useDeleteOutlet();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Outlet | null>(null);
  const [form, setForm] = useState({ name: "", address: "" });
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", address: "" });
    setDialogOpen(true);
  };

  const openEdit = (outlet: Outlet) => {
    setEditing(outlet);
    setForm({ name: outlet.name, address: outlet.address });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Outlet name is required");
      return;
    }
    try {
      if (editing) {
        await updateOutlet.mutateAsync({
          id: editing.id,
          name: form.name.trim(),
          address: form.address.trim(),
        });
        toast.success("Outlet updated");
      } else {
        await createOutlet.mutateAsync({
          name: form.name.trim(),
          address: form.address.trim(),
        });
        toast.success("Outlet created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed — backend may be unavailable");
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteOutlet.mutateAsync(id);
      toast.success("Outlet deleted");
    } catch {
      toast.error("Failed to delete outlet");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {outlets.length} outlet{outlets.length !== 1 ? "s" : ""}
        </p>
        <Button
          data-ocid="outlet.add_button"
          size="sm"
          onClick={openAdd}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Outlet
        </Button>
      </div>

      {outlets.length === 0 ? (
        <div
          data-ocid="outlet.empty_state"
          className="flex flex-col items-center justify-center h-48 text-muted-foreground border border-dashed border-border rounded-xl"
        >
          <MapPin className="w-8 h-8 mb-2" />
          <p className="text-sm">No outlets yet</p>
          <p className="text-xs">
            Add your first outlet using the button above
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Address
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outlets.map((outlet, idx) => (
                <TableRow
                  key={outlet.id.toString()}
                  data-ocid={`outlet.item.${idx + 1}`}
                  className="border-border"
                >
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      {outlet.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {outlet.address || (
                      <span className="italic text-xs">No address set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        data-ocid={`outlet.copy_link_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-muted-foreground hover:text-primary"
                        title="Copy staff link"
                        onClick={() => {
                          const url = `${window.location.origin}${window.location.pathname}?outlet=${outlet.id}`;
                          navigator.clipboard
                            .writeText(url)
                            .then(() =>
                              toast.success(
                                `Staff link for "${outlet.name}" copied!`,
                              ),
                            )
                            .catch(() => toast.error("Failed to copy link"));
                        }}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-ocid={`outlet.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => openEdit(outlet)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-ocid={`outlet.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(outlet.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="outlet.dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Outlet" : "New Outlet"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="outlet-name"
                className="text-xs text-muted-foreground"
              >
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="outlet-name"
                data-ocid="outlet.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Grub Shala - Main Branch"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="outlet-address"
                className="text-xs text-muted-foreground"
              >
                Address{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Input
                id="outlet-address"
                data-ocid="outlet.address.input"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="e.g. 12 MG Road, Bangalore"
                className="bg-input border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="outlet.cancel_button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="outlet.save_button"
              onClick={handleSave}
              disabled={createOutlet.isPending || updateOutlet.isPending}
              className="bg-primary text-primary-foreground"
            >
              {(createOutlet.isPending || updateOutlet.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          data-ocid="outlet.delete_dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>Delete Outlet?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Orders associated with this outlet
            will not be affected.
          </p>
          <DialogFooter>
            <Button
              data-ocid="outlet.delete_cancel_button"
              variant="ghost"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="outlet.delete_confirm_button"
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteOutlet.isPending}
            >
              {deleteOutlet.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Categories Tab ----
function CategoriesTab() {
  const { data: backendCats } = useListCategories();
  const categories: Category[] =
    backendCats && backendCats.length > 0 ? backendCats : SEED_CATEGORIES;

  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", sortOrder: "" });
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", sortOrder: String(categories.length + 1) });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, sortOrder: cat.sortOrder.toString() });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    try {
      if (editing) {
        await updateCat.mutateAsync({
          id: editing.id,
          name: form.name.trim(),
          sortOrder: BigInt(form.sortOrder || 0),
        });
        toast.success("Category updated");
      } else {
        await createCat.mutateAsync({
          name: form.name.trim(),
          sortOrder: BigInt(form.sortOrder || 0),
        });
        toast.success("Category created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed — backend may be unavailable");
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteCat.mutateAsync(id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length} categories
        </p>
        <Button
          data-ocid="category.add_button"
          size="sm"
          onClick={openAdd}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs">
                Name
              </TableHead>
              <TableHead className="text-muted-foreground text-xs">
                Sort Order
              </TableHead>
              <TableHead className="text-muted-foreground text-xs text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat, idx) => (
              <TableRow
                key={cat.id.toString()}
                data-ocid={`category.item.${idx + 1}`}
                className="border-border"
              >
                <TableCell className="font-medium text-sm">
                  <span className="mr-2">{ITEM_EMOJIS[cat.name] ?? "📁"}</span>
                  {cat.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {cat.sortOrder.toString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      data-ocid={`category.edit_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={() => openEdit(cat)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      data-ocid={`category.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(cat.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="category.dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="cat-name"
                className="text-xs text-muted-foreground"
              >
                Name
              </Label>
              <Input
                id="cat-name"
                data-ocid="category.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Beverages"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="cat-sort"
                className="text-xs text-muted-foreground"
              >
                Sort Order
              </Label>
              <Input
                id="cat-sort"
                data-ocid="category.sort.input"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sortOrder: e.target.value }))
                }
                className="bg-input border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="category.cancel_button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="category.save_button"
              onClick={handleSave}
              disabled={createCat.isPending || updateCat.isPending}
              className="bg-primary text-primary-foreground"
            >
              {(createCat.isPending || updateCat.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          data-ocid="category.delete_dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              data-ocid="category.delete_cancel_button"
              variant="ghost"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="category.delete_confirm_button"
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteCat.isPending}
            >
              {deleteCat.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Menu Items Tab ----
function MenuItemsTab() {
  const { data: backendCats } = useListCategories();
  const { data: backendItems } = useListMenuItems();
  const categories: Category[] =
    backendCats && backendCats.length > 0 ? backendCats : SEED_CATEGORIES;
  const items: MenuItem[] =
    backendItems && backendItems.length > 0 ? backendItems : SEED_MENU_ITEMS;

  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    priceCents: "",
    categoryId: "",
    available: true,
  });
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const getCatName = (id: bigint) =>
    categories.find((c) => c.id === id)?.name ?? "Unknown";

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      priceCents: "",
      categoryId: categories[0]?.id.toString() ?? "",
      available: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      priceCents: (Number(item.priceCents) / 100).toFixed(2),
      categoryId: item.categoryId.toString(),
      available: item.available,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.priceCents) {
      toast.error("Name and price are required");
      return;
    }
    const priceCents = BigInt(
      Math.round(Number.parseFloat(form.priceCents) * 100),
    );
    try {
      if (editing) {
        await updateItem.mutateAsync({
          id: editing.id,
          categoryId: BigInt(form.categoryId),
          name: form.name.trim(),
          description: form.description.trim(),
          priceCents,
          available: form.available,
        });
        toast.success("Item updated");
      } else {
        await createItem.mutateAsync({
          categoryId: BigInt(form.categoryId),
          name: form.name.trim(),
          description: form.description.trim(),
          priceCents,
        });
        toast.success("Item created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed — backend may be unavailable");
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} items</p>
        <Button
          data-ocid="menuitem.add_button"
          size="sm"
          onClick={openAdd}
          className="bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <ScrollArea className="max-h-[480px]">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Price
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow
                  key={item.id.toString()}
                  data-ocid={`menuitem.item.${idx + 1}`}
                  className="border-border"
                >
                  <TableCell className="font-medium text-sm">
                    <span className="mr-1.5">
                      {ITEM_EMOJIS[item.name] ?? "🍽️"}
                    </span>
                    {item.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {getCatName(item.categoryId)}
                  </TableCell>
                  <TableCell className="text-primary text-sm font-semibold">
                    {formatPrice2(item.priceCents)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.available ? "default" : "secondary"}
                      className={`text-xs ${item.available ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary text-muted-foreground"}`}
                    >
                      {item.available ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        data-ocid={`menuitem.edit_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-ocid={`menuitem.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="menuitem.dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Menu Item" : "New Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                data-ocid="menuitem.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Item name"
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Input
                data-ocid="menuitem.description.input"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description"
                className="bg-input border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Price (₹)
                </Label>
                <Input
                  data-ocid="menuitem.price.input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.priceCents}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, priceCents: e.target.value }))
                  }
                  placeholder="99.00"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, categoryId: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="menuitem.category.select"
                    className="bg-input border-border h-9"
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {editing && (
              <div className="flex items-center gap-3">
                <Switch
                  data-ocid="menuitem.available.switch"
                  id="item-available"
                  checked={form.available}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, available: v }))
                  }
                />
                <Label htmlFor="item-available" className="text-sm">
                  Available
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              data-ocid="menuitem.cancel_button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="menuitem.save_button"
              onClick={handleSave}
              disabled={createItem.isPending || updateItem.isPending}
              className="bg-primary text-primary-foreground"
            >
              {(createItem.isPending || updateItem.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent
          data-ocid="menuitem.delete_dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>Delete Item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the item from the menu.
          </p>
          <DialogFooter>
            <Button
              data-ocid="menuitem.delete_cancel_button"
              variant="ghost"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="menuitem.delete_confirm_button"
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteItem.isPending}
            >
              {deleteItem.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Orders Tab ----
function OrdersTab() {
  const { data: orders, isLoading } = useListRecentOrders(200n);
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<bigint | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async (id: bigint) => {
    try {
      await deleteOrder.mutateAsync(id);
      toast.success("Order deleted");
    } catch {
      toast.error("Failed to delete order");
    }
    setDeleteOrderId(null);
  };

  const allOrders = orders ?? [];

  const displayOrders = dateFilter
    ? allOrders.filter((o) => {
        const d = new Date(Number(o.createdAt) / 1_000_000);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}` === dateFilter;
      })
    : allOrders;

  const totalSaleCents = displayOrders.reduce(
    (sum, o) => sum + Number(o.totalCents),
    0,
  );

  const handleDownloadCSV = () => {
    const headers = [
      "Order#",
      "Customer Name",
      "Mobile",
      "Date",
      "Items",
      "Subtotal",
      "Tax",
      "Total",
      "Status",
    ];
    const rows = displayOrders.map((o) => {
      const { label } = getStatusLabel(o.status);
      const itemsStr = o.items
        .map((i) => `${i.name} x${i.quantity}`)
        .join("; ");
      return [
        o.orderNumber.toString(),
        o.customerName,
        o.customerMobile,
        formatOrderDate(o.createdAt),
        itemsStr,
        formatPrice2(o.subtotalCents),
        formatPrice2(o.taxCents),
        formatPrice2(o.totalCents),
        label,
      ];
    });
    downloadCSV(`orders_${dateFilter || "all"}.csv`, [headers, ...rows]);
  };

  if (isLoading) {
    return (
      <div
        data-ocid="orders.loading_state"
        className="flex items-center justify-center h-48 text-muted-foreground"
      >
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters & actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Label
            htmlFor="date-filter"
            className="text-xs text-muted-foreground whitespace-nowrap"
          >
            Filter by date:
          </Label>
          <Input
            id="date-filter"
            data-ocid="orders.date.input"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-8 text-xs bg-input border-border w-auto"
          />
          {dateFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs px-2"
              onClick={() => setDateFilter("")}
            >
              Clear
            </Button>
          )}
        </div>
        <Button
          data-ocid="orders.download.button"
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          className="h-8 text-xs border-border"
          disabled={displayOrders.length === 0}
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download CSV
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {displayOrders.length} order{displayOrders.length !== 1 ? "s" : ""}
        {dateFilter && " for selected date"}
      </p>

      {displayOrders.length === 0 ? (
        <div
          data-ocid="orders.empty_state"
          className="flex flex-col items-center justify-center h-48 text-muted-foreground"
        >
          <Clock className="w-8 h-8 mb-2" />
          <p className="text-sm">No orders found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs">
                  #
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Customer
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Date
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Total
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayOrders.map((order, idx) => {
                const { label, color } = getStatusLabel(order.status);
                return (
                  <TableRow
                    key={order.id.toString()}
                    data-ocid={`orders.item.${idx + 1}`}
                    className="border-border cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <TableCell className="font-mono text-sm">
                      #{order.orderNumber.toString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerMobile}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatOrderDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-primary font-semibold text-sm">
                      {formatPrice2(order.totalCents)}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${color}`}>
                        {label}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {"pending" in order.status && (
                          <>
                            <Button
                              data-ocid={`orders.complete_button.${idx + 1}`}
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 text-primary hover:text-primary"
                              onClick={() =>
                                handleStatusChange(order, { completed: null })
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              data-ocid={`orders.void_button.${idx + 1}`}
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 text-destructive hover:text-destructive"
                              onClick={() =>
                                handleStatusChange(order, { voided: null })
                              }
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          data-ocid={`orders.delete_button.${idx + 1}`}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteOrderId(order.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* Total sale summary */}
          <div className="px-4 py-3 border-t border-border bg-secondary/30 flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              Total Sale ({displayOrders.length} orders)
            </span>
            <span className="text-base font-bold text-primary">
              {formatPrice2(BigInt(totalSaleCents))}
            </span>
          </div>
        </div>
      )}

      {/* Order detail dialog */}
      <Dialog
        open={selectedOrder !== null}
        onOpenChange={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <DialogContent
            data-ocid="orders.detail_dialog"
            className="bg-card border-border max-w-md"
          >
            <DialogHeader>
              <DialogTitle>
                Order #{selectedOrder.orderNumber.toString()}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mobile</p>
                  <p className="font-medium">{selectedOrder.customerMobile}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatOrderDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-foreground">
                      {item.name} x{item.quantity.toString()}
                    </span>
                    <span className="text-primary font-medium">
                      {formatPrice2(
                        BigInt(Number(item.priceCents) * Number(item.quantity)),
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice2(selectedOrder.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatPrice2(selectedOrder.taxCents)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice2(selectedOrder.totalCents)}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="orders.close_button"
                variant="ghost"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete order confirm */}
      <Dialog
        open={deleteOrderId !== null}
        onOpenChange={() => setDeleteOrderId(null)}
      >
        <DialogContent
          data-ocid="orders.delete_dialog"
          className="bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>Delete Order?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The order record will be permanently
            removed.
          </p>
          <DialogFooter>
            <Button
              data-ocid="orders.delete_cancel_button"
              variant="ghost"
              onClick={() => setDeleteOrderId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="orders.delete_confirm_button"
              variant="destructive"
              onClick={() => deleteOrderId && handleDeleteOrder(deleteOrderId)}
              disabled={deleteOrder.isPending}
            >
              {deleteOrder.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Customers Tab ----
function CustomersTab() {
  const { data: orders } = useListRecentOrders(200n);
  const allOrders = orders ?? [];

  // Deduplicate customers by mobile — keep latest name, accumulate orders/spend
  const customerMap = new Map<
    string,
    { name: string; mobile: string; totalOrders: number; totalSpent: number }
  >();

  for (const order of allOrders) {
    const key = order.customerMobile;
    const existing = customerMap.get(key);
    if (existing) {
      existing.name = order.customerName; // keep latest
      existing.totalOrders += 1;
      existing.totalSpent += Number(order.totalCents);
    } else {
      customerMap.set(key, {
        name: order.customerName,
        mobile: order.customerMobile,
        totalOrders: 1,
        totalSpent: Number(order.totalCents),
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent,
  );

  const handleDownloadCSV = () => {
    const headers = ["Name", "Mobile", "Total Orders", "Total Spent"];
    const rows = customers.map((c) => [
      c.name,
      c.mobile,
      c.totalOrders.toString(),
      formatPrice2(BigInt(c.totalSpent)),
    ]);
    downloadCSV("customers.csv", [headers, ...rows]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {customers.length} unique customer{customers.length !== 1 ? "s" : ""}
        </p>
        <Button
          data-ocid="customers.download.button"
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          disabled={customers.length === 0}
          className="h-8 text-xs border-border"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download CSV
        </Button>
      </div>

      {customers.length === 0 ? (
        <div
          data-ocid="customers.empty_state"
          className="flex flex-col items-center justify-center h-48 text-muted-foreground"
        >
          <Users className="w-8 h-8 mb-2" />
          <p className="text-sm">No customers yet</p>
          <p className="text-xs">Customers appear once orders are placed</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Mobile
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Total Orders
                </TableHead>
                <TableHead className="text-muted-foreground text-xs text-right">
                  Total Spent
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, idx) => (
                <TableRow
                  key={customer.mobile}
                  data-ocid={`customers.item.${idx + 1}`}
                  className="border-border"
                >
                  <TableCell className="font-medium text-sm">
                    {customer.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {customer.mobile}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-right text-primary font-semibold text-sm">
                    {formatPrice2(BigInt(customer.totalSpent))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

interface AdminScreenProps {
  onLogout?: () => void;
  onChangePassword?: (oldPass: string, newPass: string) => boolean;
}

export default function AdminScreen({
  onLogout: _onLogout,
  onChangePassword,
}: AdminScreenProps) {
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pwdError, setPwdError] = useState("");

  function handleChangePwd(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    if (newPass !== confirmPass) {
      setPwdError("New passwords do not match");
      return;
    }
    if (newPass.length < 4) {
      setPwdError("Password must be at least 4 characters");
      return;
    }
    if (onChangePassword?.(oldPass, newPass)) {
      toast.success("Password changed successfully");
      setShowChangePwd(false);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setPwdError("Current password is incorrect");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto p-4 md:p-6"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage categories, menu items, orders, customers, and outlets
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          data-ocid="admin.security.open_modal_button"
          onClick={() => setShowChangePwd(true)}
          className="shrink-0 gap-1.5 text-muted-foreground border-border"
        >
          <KeyRound className="w-4 h-4" />
          <span className="hidden sm:inline">Change Password</span>
        </Button>
      </div>

      <Dialog open={showChangePwd} onOpenChange={setShowChangePwd}>
        <DialogContent
          data-ocid="admin.security.dialog"
          className="bg-pos-panel border-border"
        >
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePwd} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="old-pass">Current Password</Label>
              <Input
                id="old-pass"
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-pass">New Password</Label>
              <Input
                id="new-pass"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass">Confirm New Password</Label>
              <Input
                id="confirm-pass"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>
            {pwdError && (
              <p
                data-ocid="admin.security.error_state"
                className="text-sm text-destructive"
              >
                {pwdError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.security.cancel_button"
                onClick={() => setShowChangePwd(false)}
              >
                Cancel
              </Button>
              <Button type="submit" data-ocid="admin.security.submit_button">
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="categories">
        <TabsList
          data-ocid="admin.tab"
          className="bg-secondary border border-border mb-6 flex-wrap h-auto gap-1"
        >
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="items"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
          >
            Menu Items
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
          >
            Customers
          </TabsTrigger>
          <TabsTrigger
            value="outlets"
            className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
          >
            Outlets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="items">
          <MenuItemsTab />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
        <TabsContent value="customers">
          <CustomersTab />
        </TabsContent>
        <TabsContent value="outlets">
          <OutletsTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
