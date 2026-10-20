import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { splitParagraphs, blocksToParagraphs, type BlockNode } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";

interface FopeaPageData {
  introducao?: string;
  corpo?: BlockNode[];
  galeria?: StrapiMedia[];
  link_youtube?: string;
}

async function getFopeaData() {
  return fetchStrapi<FopeaPageData>("/fopea-page", { populate: "galeria" });
}

export default async function FopeaPage() {
  const fopea = await getFopeaData();
  const intro = splitParagraphs(fopea?.introducao);
  const corpo = blocksToParagraphs(fopea?.corpo);
  const paragrafos = [...intro, ...corpo];
  const galeria = fopea?.galeria ?? [];

  return (
    <div className="pb-20">
      <PageHeader
        title="FOPEA"
        description="Formação de Professores em Educação Ambiental — Parque Nacional do Iguaçu."
      />

      <section className="max-w-7xl mx-auto px-4">
        <div className="space-y-4 text-muted-foreground leading-relaxed max-w-3xl mb-12">
          {paragrafos.length > 0 ? (
            paragrafos.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p className="text-sm">
              Conteúdo em cadastro no Strapi (Content Manager → FOPEA Page).
            </p>
          )}
        </div>

        {fopea?.link_youtube && (
          <a
            href={fopea.link_youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent hover:opacity-90 text-accent-foreground px-6 py-3 rounded-md font-bold mb-12"
          >
            Assistir no YouTube
          </a>
        )}

        {galeria.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galeria.map((img) => {
              const url = strapiMediaUrl(img);
              return url ? (
                <div key={img.id} className="aspect-square rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ) : null;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
