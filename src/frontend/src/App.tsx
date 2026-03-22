import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useReducer, useState } from "react";
import type { MenuItem } from "./backend.d";
import AdminLoginScreen from "./components/AdminLoginScreen";
import AdminScreen from "./components/AdminScreen";
import Header from "./components/Header";
import POSScreen from "./components/POSScreen";
import { useAdminAuth } from "./hooks/useAdminAuth";

export type CartItem = {
  menuItemId: bigint;
  name: string;
  priceCents: bigint;
  quantity: number;
};

type CartAction =
  | { type: "ADD"; item: MenuItem }
  | { type: "REMOVE"; menuItemId: bigint }
  | { type: "UPDATE_QTY"; menuItemId: bigint; qty: number }
  | { type: "CLEAR" };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.menuItemId === action.item.id);
      if (existing) {
        return state.map((i) =>
          i.menuItemId === action.item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...state,
        {
          menuItemId: action.item.id,
          name: action.item.name,
          priceCents: action.item.priceCents,
          quantity: 1,
        },
      ];
    }
    case "REMOVE":
      return state.filter((i) => i.menuItemId !== action.menuItemId);
    case "UPDATE_QTY":
      if (action.qty <= 0)
        return state.filter((i) => i.menuItemId !== action.menuItemId);
      return state.map((i) =>
        i.menuItemId === action.menuItemId ? { ...i, quantity: action.qty } : i,
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export type AppView = "pos" | "admin";

export default function App() {
  const [view, setView] = useState<AppView>("pos");
  const [cart, dispatch] = useReducer(cartReducer, []);
  const { isLoggedIn, login, logout, changePassword } = useAdminAuth();

  const addToCart = useCallback(
    (item: MenuItem) => dispatch({ type: "ADD", item }),
    [],
  );
  const removeFromCart = useCallback(
    (menuItemId: bigint) => dispatch({ type: "REMOVE", menuItemId }),
    [],
  );
  const updateQty = useCallback(
    (menuItemId: bigint, qty: number) =>
      dispatch({ type: "UPDATE_QTY", menuItemId, qty }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  function handleLogout() {
    logout();
    setView("pos");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          view={view}
          onViewChange={setView}
          isAdminLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-hidden">
          {view === "pos" ? (
            <POSScreen
              cart={cart}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onUpdateQty={updateQty}
              onClearCart={clearCart}
            />
          ) : isLoggedIn ? (
            <AdminScreen
              onLogout={handleLogout}
              onChangePassword={changePassword}
            />
          ) : (
            <AdminLoginScreen onLogin={login} />
          )}
        </main>
        <footer className="py-3 text-center text-xs text-muted-foreground border-t border-border">
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
