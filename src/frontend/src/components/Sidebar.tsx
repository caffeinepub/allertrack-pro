import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  Atom,
  FlaskConical,
  HelpCircle,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useSamples } from "../hooks/useQueries";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: boolean;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/samples", icon: FlaskConical, label: "Samples", badge: true },
  { to: "/new-sample", icon: PlusCircle, label: "New Sample" },
  { to: "/referrals", icon: ArrowRightLeft, label: "Referrals" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

import type React from "react";

export function Sidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: samples } = useSamples();
  const sampleCount = samples?.length ?? 0;

  return (
    <aside
      className="fixed inset-y-0 left-0 w-64 flex flex-col z-30"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.18 0.025 230) 0%, oklch(0.22 0.025 225) 100%)",
        boxShadow: "2px 0 16px 0 oklch(0.10 0.02 230 / 0.5)",
      }}
    >
      {/* Logo area */}
      <div className="px-5 pt-5 pb-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-xl p-1.5 shadow-lg">
            <img
              src="/assets/uploads/images-019d20b1-f273-77c0-a7b1-6b3517fa9a5b-1.png"
              alt="Ultimate Medical Laboratories"
              className="w-20 h-20 object-contain rounded-lg"
            />
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-sidebar-foreground text-sm leading-tight">
              AllerTrack Pro
            </p>
            <p className="text-xs text-sidebar-foreground/50 leading-tight">
              Ultimate Medical Labs
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge, exact }) => {
          const isActive = exact
            ? currentPath === to
            : currentPath.startsWith(to);
          return (
            <Link
              key={to}
              to={to as "/"}
              data-ocid={`nav.${label.toLowerCase().replace(" ", "_")}.link`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/30"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-sidebar-primary" : ""}
              />
              <span className="flex-1">{label}</span>
              {badge && sampleCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  {sampleCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Atom decoration */}
      <div className="px-5 py-3 flex items-center gap-2 opacity-20">
        <Atom size={16} className="text-sidebar-primary" />
        <div className="h-px flex-1 bg-sidebar-border" />
      </div>

      {/* Help block */}
      <div className="mx-3 mb-3 px-3 py-3 rounded-lg bg-sidebar-accent border border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={14} className="text-sidebar-primary" />
          <span className="text-xs font-semibold text-sidebar-foreground/80">
            Need Help?
          </span>
        </div>
        <p className="text-xs text-sidebar-foreground/50">
          Contact lab support for assistance
        </p>
      </div>

      {/* Branding footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/40 leading-relaxed text-center">
          Developed by{" "}
          <span className="text-sidebar-primary font-semibold">Thabzizi</span>
          <br />
          Authorized by{" "}
          <span className="text-sidebar-primary font-semibold">Daisy</span>
        </p>
      </div>
    </aside>
  );
}
