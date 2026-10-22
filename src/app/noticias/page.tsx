import Link from "next/link";
import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { formatDate, formatDateRange, todayISO } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";

interface Noticia {
  id: number;
  titulo: string;
  slug?: string | null;
  resumo?: string;
  imagem?: StrapiMedia | null;
  data: string;
}

interface Evento {
  id: number;
  titulo: string;
  data: string;
  data_fim?: string | null;
  descricao?: string | null;
  local?: string;
  imagem?: StrapiMedia | null;
}

async function getNoticiasData() {
  const [noticias, eventos] = await Promise.all([
    fetchStrapi<Noticia[]>("/noticias", { populate: "imagem", sort: "data:desc" }),
    fetchStrapi<Evento[]>("/eventos", {
      populate: "imagem",
      sort: "data:asc",
      "pagination[pageSize]": "100",
    }),
  ]);
  return { noticias: noticias ?? [], eventos: eventos ?? [] };
}

/** Próximos: ainda não terminaram (data_fim, ou data quando não há fim) — mais próximo primeiro.
 *  Anteriores: já terminaram — mais recente primeiro. Datas YYYY-MM-DD comparam como string. */
function splitEventos(eventos: Evento[]) {
  const today = todayISO();
  const fim = (ev: Evento) => ev.data_fim || ev.data;
  return {
    proximos: eventos.filter((ev) => fim(ev) >= today),
    anteriores: eventos.filter((ev) => fim(ev) < today).reverse(),
  };
}

function EventoCard({ ev, past = false }: { ev: Evento; past?: boolean }) {
  const img = strapiMediaUrl(ev.imagem);
  return (
    <div
      className={`p-4 rounded border-l-2 ${
        past ? "border-border bg-muted" : "border-primary bg-secondary"
      }`}
    >
      {img && (
        <a
          href={img}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3 rounded overflow-hidden"
          aria-label={`Abrir imagem do evento ${ev.titulo}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={ev.imagem?.alternativeText || `Folder do evento ${ev.titulo}`}
            className={`w-full max-h-80 object-contain bg-background ${past ? "opacity-80" : ""}`}
          />
        </a>
      )}
      <span
        className={`block font-bold leading-none text-sm mb-2 ${
          past ? "text-muted-foreground" : "text-primary"
        }`}
      >
        {formatDateRange(ev.data, ev.data_fim)}
      </span>
      <h5 className="font-semibold text-sm text-foreground leading-tight">{ev.titulo}</h5>
      {ev.local && <p className="text-xs text-muted-foreground mt-1">{ev.local}</p>}
      {ev.descricao && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{ev.descricao}</p>
      )}
    </div>
  );
}

export default async function NoticiasPage() {
  const { noticias, eventos } = await getNoticiasData();
  const { proximos, anteriores } = splitEventos(eventos);

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
                Nenhuma notícia publicada no momento.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {noticias.map((n) => {
                  const img = strapiMediaUrl(n.imagem);
                  return (
                    <Link
                      key={n.id}
                      href={n.slug ? `/noticias/${n.slug}` : "/noticias"}
                      className="group block"
                    >
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
                      <h3 className="text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                        {n.titulo}
                      </h3>
                      {n.resumo && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{n.resumo}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <aside>
            <h3 className="text-xl font-bold text-foreground mb-6">Agenda de Eventos</h3>
            {proximos.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhum evento agendado no momento.
              </p>
            ) : (
              <div className="space-y-4">
                {proximos.map((ev) => (
                  <EventoCard key={ev.id} ev={ev} />
                ))}
              </div>
            )}

            {anteriores.length > 0 && (
              <>
                <h4 className="text-base font-bold text-foreground mt-10 mb-4">
                  Eventos anteriores
                </h4>
                <div className="space-y-4">
                  {anteriores.map((ev) => (
                    <EventoCard key={ev.id} ev={ev} past />
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
