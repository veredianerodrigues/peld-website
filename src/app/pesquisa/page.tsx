import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { splitParagraphs } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";

interface PesquisaPageData {
  introducao?: string;
}

interface Eixo {
  id: number;
  nome: string;
  descricao_completa?: string;
  objetivos?: string;
  metas?: string;
  cor?: string;
  icone_venn?: StrapiMedia | null;
}

async function getPesquisaData() {
  const [pesquisa, eixos] = await Promise.all([
    fetchStrapi<PesquisaPageData>("/pesquisa-page"),
    fetchStrapi<Eixo[]>("/eixos", { populate: "icone_venn", sort: "ordem:asc" }),
  ]);
  return { pesquisa, eixos: eixos ?? [] };
}

export default async function PesquisaPage() {
  const { pesquisa, eixos } = await getPesquisaData();
  const intro = splitParagraphs(pesquisa?.introducao);

  return (
    <div className="pb-20">
      <PageHeader
        title="Pesquisa"
        description="Os 4 eixos de atuação do PELD Iguaçu, com objetivos e metas."
      />

      {intro.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <div className="space-y-4 text-muted-foreground leading-relaxed max-w-3xl">
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 space-y-8">
        {eixos.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            Cadastre os eixos no Strapi (Content Manager → Eixo) para exibi-los aqui.
          </p>
        )}
        {eixos.map((eixo) => {
          const vennUrl = strapiMediaUrl(eixo.icone_venn);
          const cor = eixo.cor || "var(--primary)";
          const objetivos = splitParagraphs(eixo.objetivos);
          const metas = splitParagraphs(eixo.metas);
          return (
            <div
              key={eixo.id}
              className="relative flex flex-col md:flex-row items-start gap-8 bg-card p-8 md:p-12 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: cor }} />
              <div
                className="w-24 h-24 shrink-0 flex items-center justify-center rounded-3xl"
                style={{ backgroundColor: `color-mix(in srgb, ${cor} 10%, transparent)` }}
              >
                {vennUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={vennUrl} alt="" className="w-14 h-14 object-contain" />
                ) : (
                  <span className="text-2xl font-bold" style={{ color: cor }}>
                    {eixo.nome.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-grow">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: cor }}
                >
                  Eixo Científico
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-2 mb-3">{eixo.nome}</h3>
                {splitParagraphs(eixo.descricao_completa).map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {objetivos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold text-foreground text-sm mb-1">Objetivos</h4>
                    {objetivos.map((p, i) => (
                      <p key={i} className="text-muted-foreground text-sm">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                {metas.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold text-foreground text-sm mb-1">Metas</h4>
                    {metas.map((p, i) => (
                      <p key={i} className="text-muted-foreground text-sm">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
