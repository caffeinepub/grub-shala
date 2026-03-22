import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { CartItem } from "../App";
import type { Category, MenuItem } from "../backend.d";
import {
  ITEM_EMOJIS,
  ITEM_GRADIENTS,
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  formatPrice,
} from "../data/seedData";
import { useListCategories, useListMenuItems } from "../hooks/useQueries";
import CartSidebar from "./CartSidebar";

interface POSScreenProps {
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (menuItemId: bigint) => void;
  onUpdateQty: (menuItemId: bigint, qty: number) => void;
  onClearCart: () => void;
}

export default function POSScreen({
  cart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQty,
  onClearCart,
}: POSScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<bigint | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: backendCategories } = useListCategories();
  const { data: backendItems } = useListMenuItems();

  const categories: Category[] =
    backendCategories && backendCategories.length > 0
      ? backendCategories
      : SEED_CATEGORIES;

  const allItems: MenuItem[] =
    backendItems && backendItems.length > 0 ? backendItems : SEED_MENU_ITEMS;

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return allItems.filter((i) => i.available);
    return allItems.filter(
      (i) => i.categoryId === selectedCategory && i.available,
    );
  }, [allItems, selectedCategory]);

  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);

  const getCategoryName = (id: bigint) =>
    categories.find((c) => c.id === id)?.name ?? "";

  return (
    <div className="flex h-[calc(100vh-3.5rem-2.5rem)] overflow-hidden">
      {/* Left: Menu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Category tabs */}
        <div className="shrink-0 px-4 pt-3 pb-2 border-b border-border">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              data-ocid="menu.all.tab"
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id.toString()}
                data-ocid="menu.category.tab"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{ITEM_EMOJIS[cat.name] ?? "🍽️"}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                const catName = getCategoryName(item.categoryId);
                const gradient =
                  ITEM_GRADIENTS[catName] ??
                  "from-slate-800/60 to-slate-700/40";
                const emoji = ITEM_EMOJIS[item.name] ?? "🍽️";
                const cartItem = cart.find((c) => c.menuItemId === item.id);

                return (
                  <motion.div
                    key={item.id.toString()}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                    data-ocid={`menu.item.${idx + 1}`}
                    className="group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => onAddToCart(item)}
                  >
                    {/* Image area */}
                    <div
                      className={`relative h-24 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                    >
                      <span className="text-4xl">{emoji}</span>
                      {cartItem && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
                          {cartItem.quantity}
                        </Badge>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2 mb-1">
                        {item.name}
                      </p>
                      <p className="text-xs font-bold text-primary">
                        {formatPrice(item.priceCents)}
                      </p>
                    </div>
                    {/* Add button */}
                    <div className="px-2.5 pb-2.5">
                      <div className="w-full h-7 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <span className="text-xs font-medium text-primary">
                          Add to Order
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div
              data-ocid="menu.empty_state"
              className="flex flex-col items-center justify-center h-48 text-muted-foreground"
            >
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-sm">No items in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart sidebar (desktop) */}
      <div className="hidden md:flex w-80 lg:w-96 border-l border-border flex-col">
        <CartSidebar
          cart={cart}
          onRemove={onRemoveFromCart}
          onUpdateQty={onUpdateQty}
          onClear={onClearCart}
        />
      </div>

      {/* Mobile cart FAB */}
      <button
        type="button"
        data-ocid="cart.open_modal_button"
        onClick={() => setCartOpen(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary rounded-full shadow-panel flex items-center justify-center z-30"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6 text-primary-foreground" />
        {totalQty > 0 && (
          <span className="absolute -top-1 -right-1 bg-pos-amber text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalQty}
          </span>
        )}
      </button>

      {/* Mobile cart bottom sheet */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              data-ocid="cart.sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <h2 className="font-semibold text-foreground">Order Cart</h2>
                <button
                  type="button"
                  data-ocid="cart.close_button"
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <CartSidebar
                  cart={cart}
                  onRemove={onRemoveFromCart}
                  onUpdateQty={onUpdateQty}
                  onClear={onClearCart}
                  onOrderPlaced={() => setCartOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
