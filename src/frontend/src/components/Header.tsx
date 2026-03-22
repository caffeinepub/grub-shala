import { Button } from "@/components/ui/button";
import {
  ChefHat,
  LayoutGrid,
  LogOut,
  Settings,
  ShoppingCart,
} from "lucide-react";
import type { AppView } from "../App";

interface HeaderProps {
  view: AppView;
  onViewChange: (v: AppView) => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export default function Header({
  view,
  onViewChange,
  isAdminLoggedIn,
  onLogout,
}: HeaderProps) {
  return (
    <header className="h-14 bg-pos-panel border-b border-border flex items-center px-4 gap-4 shrink-0 shadow-panel z-10">
      {/* Brand */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <ChefHat className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">
          Grub Shala
        </span>
      </div>

      {/* Nav */}
      <nav
        className="flex items-center gap-1 flex-1"
        aria-label="Main navigation"
      >
        <Button
          variant="ghost"
          size="sm"
          data-ocid="nav.pos.link"
          onClick={() => onViewChange("pos")}
          className={`relative h-9 px-3 text-sm ${
            view === "pos"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">POS</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-ocid="nav.admin.link"
          onClick={() => onViewChange("admin")}
          className={`relative h-9 px-3 text-sm ${
            view === "admin"
              ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">Admin</span>
        </Button>
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {view === "admin" && isAdminLoggedIn && onLogout ? (
          <Button
            variant="ghost"
            size="sm"
            data-ocid="admin.logout.button"
            onClick={onLogout}
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </Button>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-foreground">
                Cashier
              </span>
              <span className="text-xs text-muted-foreground">Staff</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
