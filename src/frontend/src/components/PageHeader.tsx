import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Bell, PlusCircle, Search, UserCircle } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  showAddButton = false,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border hover:bg-muted transition-colors"
          aria-label="Search"
        >
          <Search size={16} className="text-muted-foreground" />
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border hover:bg-muted transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
        </button>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20">
          <UserCircle size={18} className="text-primary" />
        </div>
        {showAddButton && (
          <Link to="/new-sample">
            <Button
              data-ocid="header.add_sample.button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg px-4 py-2 text-sm"
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Sample
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
