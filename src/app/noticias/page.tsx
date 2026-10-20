import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";

interface Noticia {
  id: number;
  titulo: string;
  resumo?: string;
  imagem?: StrapiMedia | null;
  data: string;
}

interface Evento {
  id: number;
  titulo: string;
  data: string;
  local?: string;
}

async function getNoticiasData() {
  const [noticias, eventos] = await Promise.all([
    fetchStrapi<Noticia[]>("/noticias", { populate: "imagem", sort: "data:desc" }),
    fetchStrapi<Evento[]>("/eventos", { sort: "data:asc" }),
  ]);
  return { noticias: noticias ?? [], eventos: eventos ?? [] };
}

export default async function NoticiasPage() {
  const { noticias, eventos } = await getNoticiasData();

  return (
    <div className="pb-20">
      <PageHeader
        title="Notícias e Eventos"
        description="Últimas notícias e agenda de eventos do PELD Iguaçu."
      />

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {noticias.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Cadastre notícias no Strapi (Content Manager → Notícia) para exibi-las aqui.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {noticias.map((n) => {
                  const img = strapiMediaUrl(n.imagem);
                  return (
                    <div key={n.id}>
                      {img && (
                        <div className="aspect-video rounded-lg overflow-hidden mb-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={n.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="text-xs text-primary font-bold mb-2 uppercase">
                        {formatDate(n.data)}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
                        {n.titulo}
                      </h3>
                      {n.resumo && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{n.resumo}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside>
            <h3 className="text-xl font-bold text-foreground mb-6">Agenda de Eventos</h3>
            {eventos.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Cadastre eventos no Strapi (Content Manager → Evento) para exibi-los aqui.
              </p>
            ) : (
              <div className="space-y-4">
                {eventos.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex gap-4 p-4 rounded border-l-2 border-primary bg-soft-teal"
                  >
                    <div className="text-center shrink-0">
                      <span className="block font-bold text-primary leading-none text-sm">
                        {formatDate(ev.data)}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-foreground leading-tight">
                        {ev.titulo}
                      </h5>
                      {ev.local && (
                        <p className="text-xs text-muted-foreground mt-1">{ev.local}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
