import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Eclipse Tech" },
      {
        name: "description",
        content:
          "Saiba como a Eclipse Tech coleta, utiliza e protege seus dados pessoais.",
      },
      { property: "og:title", content: "Política de Privacidade — Eclipse Tech" },
      {
        property: "og:description",
        content: "Política de privacidade, cookies e uso de dados na Eclipse Tech.",
      },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Política de <span className="text-gradient-neon">Privacidade</span>
        </h1>
        <p className="mt-3 text-xs text-muted-foreground">
          Última atualização: 7 de maio de 2026
        </p>

        <div className="prose-invert mt-8 space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">1. Dados coletados</h2>
            <p className="mt-2">
              Coletamos informações limitadas, como dados de navegação, endereço IP, tipo de
              navegador e páginas acessadas, com finalidade exclusivamente analítica.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">2. Cookies</h2>
            <p className="mt-2">
              Utilizamos cookies próprios e de terceiros (Google Analytics, Google AdSense)
              para personalizar conteúdo, exibir anúncios relevantes e analisar tráfego.
              Você pode desativar cookies nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">3. Anúncios</h2>
            <p className="mt-2">
              A Eclipse Tech exibe anúncios via Google AdSense. O Google pode utilizar
              cookies para personalizar a publicidade com base em visitas anteriores a este
              e outros sites. Saiba mais em
              <a href="https://policies.google.com/technologies/ads" className="text-neon underline" target="_blank" rel="noopener noreferrer"> políticas de anúncios do Google</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">4. Compartilhamento</h2>
            <p className="mt-2">
              Não vendemos seus dados pessoais. Compartilhamos informações apenas com
              parceiros estritamente necessários (analytics e publicidade) e quando exigido
              por lei.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">5. Seus direitos (LGPD)</h2>
            <p className="mt-2">
              Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer
              momento enviando um e-mail para <span className="text-neon">privacidade@eclipsetech.com</span>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-foreground">6. Contato</h2>
            <p className="mt-2">
              Em caso de dúvidas sobre esta política, entre em contato pela nossa
              <a href="/contato" className="text-neon underline"> página de contato</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
