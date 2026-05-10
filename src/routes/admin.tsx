import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Eclipse Tech" }] }),
});

function AdminLayout() {
  const { user, isAdmin, loading, roleLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="p-8 text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta ({user.email}) não possui permissão de administrador.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Para se tornar admin, conceda o papel <code className="text-neon">admin</code> no
            backend (tabela user_roles) com seu user_id: <br />
            <code className="break-all text-neon">{user.id}</code>
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl font-bold">
              <span className="text-gradient-neon">Admin</span>
            </h1>
            <nav className="flex gap-3 text-sm">
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-neon"
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-neon" }}
              >
                Posts
              </Link>
              <Link
                to="/admin/new"
                className="text-muted-foreground hover:text-neon"
                activeProps={{ className: "text-neon" }}
              >
                Novo
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{user.email}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
            >
              Sair
            </Button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
