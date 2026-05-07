import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import logo from "@/assets/eclipse-logo.png";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={logo}
            alt="Eclipse Tech"
            width={32}
            height={32}
            className="h-8 w-8 transition-transform duration-500 group-hover:rotate-180"
          />
          <span className="font-display text-lg font-bold tracking-tight">
            Eclipse <span className="text-gradient-neon">Tech</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              to="/c/$slug"
              params={{ slug: c.slug }}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "text-neon" }}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Buscar"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-border/50 px-4 py-3 lg:hidden">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/c/$slug"
              params={{ slug: c.slug }}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
