
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'curiosidades',
  reading_time INTEGER NOT NULL DEFAULT 3,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  api_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX posts_category_idx ON public.posts(category);
CREATE INDEX posts_published_created_idx ON public.posts(published, created_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- No public policies on the base table; access is via the secure view only.
-- Service role bypasses RLS for admin operations.

CREATE OR REPLACE VIEW public.posts_public_view
WITH (security_invoker = true) AS
SELECT
  id, title, slug, excerpt, content, cover_image, category,
  reading_time, views, likes, dislikes, published, featured,
  created_at, updated_at
FROM public.posts
WHERE published = true;

GRANT SELECT ON public.posts_public_view TO anon, authenticated;

-- Allow public read of published posts via RLS (needed for security_invoker view)
CREATE POLICY "Public can read published posts"
  ON public.posts FOR SELECT
  USING (published = true);

-- Seed data
INSERT INTO public.posts (title, slug, excerpt, content, cover_image, category, reading_time, views, likes, featured) VALUES
('A IA que sonha: dentro do cérebro digital de 2026', 'ia-que-sonha-2026', 'Pesquisadores descobriram padrões similares ao sono REM em redes neurais — e os resultados são perturbadores.', E'## O fenômeno\n\nEm laboratórios de Tóquio, redes neurais entraram em estados de baixa atividade que **se assemelham ao sono humano**. Os pesquisadores chamam isso de "modo onírico".\n\n- Ativações espontâneas inesperadas\n- Reorganização de pesos sem input externo\n- Geração de imagens "lembradas" do treino\n\n> "É como se a máquina sonhasse com o que aprendeu." — Dr. Hayashi\n\nO próximo passo é entender se isso melhora a generalização.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80', 'tecnologia', 5, 12480, 892, true),
('10 fatos bizarros sobre o oceano profundo que ninguém te contou', 'fatos-bizarros-oceano-profundo', 'Existem mais formas de vida desconhecidas no fundo do mar do que estrelas catalogadas no universo.', E'## Mergulho no desconhecido\n\nA fossa das Marianas tem pressão de **1.086 bars** — equivalente a 100 elefantes em cima do seu dedão.\n\n1. Existem rios *dentro* do oceano\n2. Lulas-vampiro brilham no escuro\n3. O som viaja 4x mais rápido na água\n\nE ainda mapeamos menos de 5% disso.', 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80', 'curiosidades', 4, 8932, 654, true),
('Por que sua banda favorita dos anos 90 está voltando aos charts em 2026', 'bandas-90-charts-2026', 'O algoritmo aprendeu a nostalgia — e está moldando o que você ouve agora.', E'## A onda retro\n\nStreaming impulsionado por IA detectou o padrão: **ouvintes Gen Z consomem rock dos 90 mais que millennials**.\n\nO resultado: turnês esgotadas, vinis em alta e remixes virais no TikTok.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80', 'musicas', 3, 6701, 412, false),
('A série mais bizarra de 2026 já tem 50 milhões de fãs obcecados', 'serie-bizarra-2026', 'Mistura de horror cósmico, drama coreano e realidade aumentada. E você ainda não assistiu?', E'## Vale o hype?\n\nA série usa **camadas de AR** durante a transmissão — cada espectador vê pistas diferentes.\n\nFinal de temporada quebrou recordes globais de engajamento.', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&q=80', 'series', 4, 15234, 1102, true),
('Cientistas descobrem proteína que pode reverter o envelhecimento celular', 'proteina-envelhecimento-celular', 'Testes em ratos mostraram regressão biológica de 30% — humanos podem ser os próximos.', E'## A fronteira da longevidade\n\nA proteína **GDF11 modificada** ativou genes adormecidos ligados à juventude celular.\n\nEnsaios clínicos começam em 2027.', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80', 'saude', 6, 9821, 743, false),
('O caso bizarro do prédio que desaparece em fotos', 'predio-desaparece-fotos', 'Em uma cidade do Japão, um edifício de 12 andares simplesmente não aparece em câmeras digitais. Engenheiros estão perplexos.', E'## Fenômeno inexplicável\n\nO revestimento do edifício parece interagir com sensores CMOS de forma única.\n\nTeorias incluem materiais metamateriais experimentais não declarados.', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80', 'bizarro', 3, 22841, 1834, true),
('A banda que tocou para 0 pessoas e viralizou com 50 milhões de views', 'banda-0-pessoas-viral', 'Um show vazio em Berlim virou o maior fenômeno cultural do ano. Como?', E'## A virada inesperada\n\nO contraste entre a performance impecável e a plateia vazia tocou algo profundo na audiência online.\n\nO álbum saltou para #1 globalmente em 48 horas.', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80', 'bandas', 4, 18203, 1421, false),
('Por que o entretenimento ao vivo está vencendo o streaming em 2026', 'entretenimento-ao-vivo-2026', 'Depois de uma década dominando, o streaming perde terreno para experiências presenciais.', E'## O retorno do físico\n\nShows, cinemas IMAX e eventos imersivos batem recordes históricos.\n\nA fadiga digital é real — e o público está votando com o bolso.', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80', 'entretenimento', 3, 7102, 521, false);
