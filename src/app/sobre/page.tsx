import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { PageHeader } from "@/components/PageHeader";
import { RichText } from "@/components/RichText";

interface ElementoMarca {
  id: number;
  titulo: string;
  descricao?: string;
  icone?: StrapiMedia | null;
}

interface Estatisticas {
  professores?: number;
  doutores?: number;
  mestres?: number;
  alunos?: number;
}

interface SecaoTexto {
  id: number;
  titulo: string;
  texto?: string | null;
  imagem?: StrapiMedia | null;
  legenda?: string | null;
}

interface SobrePageData {
  o_que_e_peld?: string;
  parque_nacional?: string;
  historia_projeto?: string;
  elementos_marca?: ElementoMarca[];
  estatisticas?: Estatisticas | null;
  marca?: SecaoTexto[];
}

interface Membro {
  id: number;
  nome: string;
  cargo?: string;
  instituicao_vinculo?: string;
  foto?: StrapiMedia | null;
  categoria: "coordenacao" | "ponto_focal";
}

async function getSobreData() {
  const [sobre, membros] = await Promise.all([
    fetchStrapi<SobrePageData>("/sobre-page", {
      "populate[elementos_marca][populate]": "icone",
      "populate[estatisticas]": "true",
      "populate[marca][populate]": "imagem",
    }),
    fetchStrapi<Membro[]>("/membros", { populate: "foto", sort: "ordem:asc" }),
  ]);
  return { sobre, membros: membros ?? [] };
}

function TextBlock({ title, text }: { title: string; text?: string }) {
  if (!text?.trim()) return null;
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      <RichText className="text-muted-foreground leading-relaxed">
        {text}
      </RichText>
    </div>
  );
}

function MembroCard({ membro }: { membro: Membro }) {
  const fotoUrl = strapiMediaUrl(membro.foto);
  return (
    <div className="flex items-center gap-4 p-6 bg-card rounded-lg shadow-sm border border-border">
      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-secondary flex items-center justify-center">
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt={membro.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-primary font-bold text-lg">
            {membro.nome.charAt(0)}
          </span>
        )}
      </div>
      <div>
        <h4 className="font-bold text-foreground">{membro.nome}</h4>
        {membro.instituicao_vinculo && (
          <p className="text-xs text-primary font-semibold mb-1 uppercase">
            {membro.instituicao_vinculo}
          </p>
        )}
        {membro.cargo && (
          <p className="text-xs text-muted-foreground">{membro.cargo}</p>
        )}
      </div>
    </div>
  );
}

export default async function SobrePage() {
  const { sobre, membros } = await getSobreData();
  const coordenacao = membros.filter((m) => m.categoria === "coordenacao");
  const pontosFocais = membros.filter((m) => m.categoria === "ponto_focal");
  const stats = sobre?.estatisticas;
  const elementos = sobre?.elementos_marca ?? [];
  const marca = sobre?.marca ?? [];

  const hasStats =
    stats &&
    (stats.professores || stats.doutores || stats.mestres || stats.alunos);

  return (
    <div className="pb-20">
      <PageHeader
        title="Sobre o Projeto"
        description="O PELD Iguaçu, o Parque Nacional, a história do projeto e quem faz parte dele."
      />

      <section className="max-w-7xl mx-auto px-4">
        <TextBlock title="O que é o PELD" text={sobre?.o_que_e_peld} />
        <TextBlock
          title="O Parque Nacional do Iguaçu"
          text={sobre?.parque_nacional}
        />
        <TextBlock title="História do Projeto" text={sobre?.historia_projeto} />

        {hasStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Professores", value: stats?.professores },
              { label: "Doutores", value: stats?.doutores },
              { label: "Mestres", value: stats?.mestres },
              { label: "Alunos", value: stats?.alunos },
            ]
              .filter((s) => s.value)
              .map((s) => (
                <div
                  key={s.label}
                  className="text-center p-6 bg-secondary rounded-lg"
                >
                  <div className="text-3xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
          </div>
        )}

        {(marca.length > 0 || elementos.length > 0) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Marca e elementos da marca
            </h2>
            {marca.length > 0 && (
              <div className="space-y-12 mb-12">
                {marca.map((secao) => {
                  const img = strapiMediaUrl(secao.imagem);
                  return (
                    <div
                      key={secao.id}
                      className={
                        img
                          ? "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                          : undefined
                      }
                    >
                      <div
                        className={img ? "lg:col-span-2 min-w-0" : undefined}
                      >
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {secao.titulo}
                        </h3>
                        <RichText className="text-muted-foreground leading-relaxed">
                          {secao.texto}
                        </RichText>
                      </div>
                      {img && (
                        <figure>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={
                              secao.imagem?.alternativeText ||
                              secao.legenda ||
                              secao.titulo
                            }
                            className="w-full h-auto rounded-lg"
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
            )}
            {elementos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {elementos.map((el) => {
                  const iconUrl = strapiMediaUrl(el.icone);
                  return (
                    <div
                      key={el.id}
                      className="text-center p-8 border border-border rounded-lg"
                    >
                      <div className="mx-auto w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mb-6">
                        {iconUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={iconUrl}
                            alt=""
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="font-bold text-lg">
                            {el.titulo.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-foreground mb-2">
                        {el.titulo}
                      </h4>
                      {el.descricao && (
                        <p className="text-sm text-muted-foreground">
                          {el.descricao}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Equipe
          </h2>

          {membros.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">
              Em breve.
            </p>
          ) : (
            <>
              {coordenacao.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4">
                    Coordenação
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coordenacao.map((m) => (
                      <MembroCard key={m.id} membro={m} />
                    ))}
                  </div>
                </div>
              )}
              {pontosFocais.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4">
                    Pontos Focais
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pontosFocais.map((m) => (
                      <MembroCard key={m.id} membro={m} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
