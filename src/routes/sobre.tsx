import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre Nós — Eclipse Tech" },
      {
        name: "description",
        content:
          "Conheça a Eclipse Tech: portal de curiosidades, tecnologia e cultura pop para a era pós-streaming.",
      },
      { property: "og:title", content: "Sobre Nós — Eclipse Tech" },
      {
        property: "og:description",
        content: "Quem somos, no que acreditamos e como produzimos conteúdo na Eclipse Tech.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Sobre a <span className="text-gradient-neon">Eclipse Tech</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A Eclipse Tech é um portal de conteúdo viral focado em curiosidades, tecnologia, ciência e
          cultura pop. Criada em 2026, nossa missão é trazer informação relevante em formato leve,
          rápido e visualmente moderno.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">Nossa missão</h2>
        <p className="mt-3 text-muted-foreground">
          Tornar a leitura na internet algo prazeroso novamente. Nada de pop-ups invasivos, nada de
          manchetes enganosas. Conteúdo direto, com curadoria humana e apoio de inteligência
          artificial.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold">O que publicamos</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>Curiosidades e fatos bizarros do cotidiano</li>
          <li>Tutoriais e análises de tecnologia</li>
          <li>Notícias sobre séries, músicas e bandas</li>
          <li>Ciência, saúde e tendências culturais</li>
        </ul>

        <h2 className="mt-10 font-display text-2xl font-bold">Equipe editorial</h2>
        <p className="mt-3 text-muted-foreground">
          Somos um time enxuto de jornalistas, designers e desenvolvedores apaixonados por construir
          uma nova forma de consumir entretenimento online.
        </p>
      </main>
      <Footer />
    </div>
  );
}
