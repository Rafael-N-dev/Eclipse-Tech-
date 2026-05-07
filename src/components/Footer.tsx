import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50 bg-surface/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold">
            Eclipse <span className="text-gradient-neon">Tech</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Portal de curiosidades, tecnologia e cultura pop para a era pós-streaming.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neon">Categorias</h4>
          <ul className="mt-3 grid grid-cols-2 gap-1.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/c/$slug"
                  params={{ slug: c.slug }}
                  className="text-muted-foreground hover:text-neon"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neon">Newsletter</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Receba os artigos mais virais da semana.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 rounded-md border border-border bg-input px-3 py-2 text-sm focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_18px_var(--neon-soft)]"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/50 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        <div className="mb-2 flex flex-wrap justify-center gap-4">
          <Link to="/sobre" className="hover:text-neon">Sobre Nós</Link>
          <Link to="/contato" className="hover:text-neon">Contato</Link>
          <Link to="/privacidade" className="hover:text-neon">Política de Privacidade</Link>
        </div>
        © {new Date().getFullYear()} Eclipse Tech. Todos os direitos reservados.
      </div>
    </footer>
  );
}
