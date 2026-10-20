import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { PageHeader } from "@/components/PageHeader";

interface Publicacao {
  id: number;
  titulo: string;
  autores?: string;
  ano?: number;
  resumo?: string;
  arquivo?: StrapiMedia | null;
}

async function getPublicacoes() {
  const data = await fetchStrapi<Publicacao[]>("/publicacoes", {
    populate: "arquivo",
    sort: "ano:desc",
  });
  return data ?? [];
}

export default async function PublicacoesPage() {
  const publicacoes = await getPublicacoes();

  return (
    <div className="pb-20">
      <PageHeader title="Publicações" description="Publicações científicas do PELD Iguaçu." />

      <section className="max-w-7xl mx-auto px-4">
        {publicacoes.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Nenhuma publicação disponível no momento.
          </p>
        ) : (
          <div className="space-y-4">
            {publicacoes.map((pub) => {
              const fileUrl = strapiMediaUrl(pub.arquivo);
              return (
                <div
                  key={pub.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card rounded-lg border border-border gap-4"
                >
                  <div>
                    <h3 className="font-bold text-foreground">{pub.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {[pub.autores, pub.ano].filter(Boolean).join(" — ")}
                    </p>
                    {pub.resumo && (
                      <p className="text-sm text-muted-foreground mt-2">{pub.resumo}</p>
                    )}
                  </div>
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded hover:bg-surface text-sm font-semibold shrink-0"
                    >
                      Baixar PDF
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
