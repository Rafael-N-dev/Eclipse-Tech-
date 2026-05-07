import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Eclipse Tech" },
      {
        name: "description",
        content:
          "Fale com a redação da Eclipse Tech: pautas, parcerias, anúncios e suporte.",
      },
      { property: "og:title", content: "Contato — Eclipse Tech" },
      {
        property: "og:description",
        content: "Envie sua mensagem para a equipe da Eclipse Tech.",
      },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Fale com a <span className="text-gradient-neon">redação</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Tem uma pauta, encontrou um erro, ou quer anunciar conosco? Envie sua mensagem.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <Mail className="h-5 w-5 text-neon" />
            <h3 className="mt-2 text-sm font-semibold">E-mail</h3>
            <p className="text-xs text-muted-foreground">contato@eclipsetech.com</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <MessageCircle className="h-5 w-5 text-neon" />
            <h3 className="mt-2 text-sm font-semibold">Imprensa</h3>
            <p className="text-xs text-muted-foreground">imprensa@eclipsetech.com</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <Send className="h-5 w-5 text-neon" />
            <h3 className="mt-2 text-sm font-semibold">Anúncios</h3>
            <p className="text-xs text-muted-foreground">ads@eclipsetech.com</p>
          </div>
        </div>

        <form
          className="mt-10 space-y-4 rounded-xl border border-border/60 bg-card p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Seu nome"
              className="rounded-md border border-border bg-input px-3 py-2 text-sm focus:border-neon focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="rounded-md border border-border bg-input px-3 py-2 text-sm focus:border-neon focus:outline-none"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Assunto"
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus:border-neon focus:outline-none"
          />
          <textarea
            rows={5}
            placeholder="Sua mensagem..."
            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm focus:border-neon focus:outline-none"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_18px_var(--neon-soft)]"
          >
            <Send className="h-4 w-4" /> Enviar mensagem
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
