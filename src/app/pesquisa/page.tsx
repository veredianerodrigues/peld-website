import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { PageHeader } from "@/components/PageHeader";
import { RichText } from "@/components/RichText";

interface SecaoTexto {
  id: number;
  titulo: string;
  texto?: string | null;
  imagem?: StrapiMedia | null;
  legenda?: string | null;
}

interface PesquisaPageData {
  introducao?: string;
  diagrama?: StrapiMedia | null;
  diagrama_legenda?: string | null;
  infraestrutura?: SecaoTexto[] | null;
}

interface Eixo {
  id: number;
  nome: string;
  descricao_curta?: string;
  descricao_completa?: string;
  objetivos?: string;
  metas?: string;
  cor?: string;
  ordem?: number | null;
  icone_venn?: StrapiMedia | null;
}

async function getPesquisaData() {
  const [pesquisa, eixos] = await Promise.all([
    fetchStrapi<PesquisaPageData>("/pesquisa-page", {
      "populate[diagrama]": "true",
      "populate[infraestrutura][populate]": "imagem",
    }),
    fetchStrapi<Eixo[]>("/eixos", { populate: "icone_venn", sort: "ordem:asc" }),
  ]);
  return { pesquisa, eixos: eixos ?? [] };
}

export default async function PesquisaPage() {
  const { pesquisa, eixos } = await getPesquisaData();
  const diagramaUrl = strapiMediaUrl(pesquisa?.diagrama);
  const infraestrutura = pesquisa?.infraestrutura ?? [];

  return (
    <div className="pb-20">
      <PageHeader
        title="Pesquisa"
        description="Os 4 eixos de atuação do PELD Iguaçu, com objetivos gerais e específicos."
      />

      {pesquisa?.introducao && (
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <RichText className="text-muted-foreground leading-relaxed max-w-3xl">
            {pesquisa.introducao}
          </RichText>
        </section>
      )}

      {diagramaUrl && (
        <section className="max-w-3xl mx-auto px-4 mb-16">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diagramaUrl}
              alt={
                pesquisa?.diagrama?.alternativeText ||
                "Diagrama de Venn com a integração entre os quatro eixos e seus objetivos específicos"
              }
              className="w-full h-auto"
            />
            {pesquisa?.diagrama_legenda && (
              <figcaption className="text-sm text-muted-foreground text-center mt-3">
                {pesquisa.diagrama_legenda}
              </figcaption>
            )}
          </figure>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 space-y-8">
        {eixos.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            Em breve.
          </p>
        )}
        {eixos.map((eixo) => {
          const vennUrl = strapiMediaUrl(eixo.icone_venn);
          const cor = eixo.cor || "var(--primary)";
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
              <div className="grow min-w-0">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: cor }}
                >
                  {eixo.ordem ? `Objetivo geral ${eixo.ordem}` : "Eixo de atuação"}
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-2">{eixo.nome}</h3>
                {eixo.descricao_curta && (
                  <p className="text-sm font-semibold mt-1" style={{ color: cor }}>
                    {eixo.descricao_curta}
                  </p>
                )}
                <RichText className="text-muted-foreground leading-relaxed mt-4">
                  {eixo.descricao_completa}
                </RichText>
                {eixo.objetivos?.trim() && (
                  <div className="mt-6">
                    <h4 className="font-bold text-foreground text-sm mb-2">Objetivos específicos</h4>
                    <RichText className="text-muted-foreground text-sm leading-relaxed">
                      {eixo.objetivos}
                    </RichText>
                  </div>
                )}
                {eixo.metas?.trim() && (
                  <div className="mt-6">
                    <h4 className="font-bold text-foreground text-sm mb-2">Metas</h4>
                    <RichText className="text-muted-foreground text-sm leading-relaxed">
                      {eixo.metas}
                    </RichText>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {infraestrutura.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <h2 className="text-3xl font-bold text-foreground mb-8">Infraestrutura de pesquisa</h2>
          <div className="space-y-12">
            {infraestrutura.map((secao) => {
              const img = strapiMediaUrl(secao.imagem);
              return (
                <div key={secao.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-foreground mb-4">{secao.titulo}</h3>
                    <RichText className="text-muted-foreground leading-relaxed">{secao.texto}</RichText>
                  </div>
                  {img && (
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={secao.imagem?.alternativeText || secao.legenda || secao.titulo}
                        className="w-full h-auto rounded-lg border border-border"
                      />
                      {secao.legenda && (
                        <figcaption className="text-xs text-muted-foreground mt-2">
                          {secao.legenda}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
