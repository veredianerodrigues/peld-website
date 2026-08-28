import Link from "next/link";
import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";

interface HomePageData {
  slogan: string;
  imagem_fundo?: StrapiMedia | null;
}

interface Eixo {
  id: number;
  nome: string;
  descricao_curta: string;
  cor?: string;
  icone?: StrapiMedia | null;
}

interface Noticia {
  id: number;
  titulo: string;
  resumo?: string;
  imagem?: StrapiMedia | null;
  data: string;
}

async function getHomeData() {
  const [home, eixos, destaques] = await Promise.all([
    fetchStrapi<HomePageData>("/home-page", { populate: "imagem_fundo" }),
    fetchStrapi<Eixo[]>("/eixos", { populate: "icone", sort: "ordem:asc" }),
    fetchStrapi<Noticia[]>("/noticias", {
      "filters[destaque][$eq]": "true",
      populate: "imagem",
      sort: "data:desc",
    }),
  ]);

  return { home, eixos: eixos ?? [], destaques: destaques ?? [] };
}

export default async function HomePage() {
  const { home, eixos, destaques } = await getHomeData();
  const heroImage = strapiMediaUrl(home?.imagem_fundo);
  const slogan =
    home?.slogan ?? "Ciência, conservação e educação no Parque Nacional do Iguaçu.";

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt="Parque Nacional do Iguaçu"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-dark" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-4xl px-4 text-white">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider">
            Programa de Pesquisas Ecológicas de Longa Duração
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            PELD Iguaçu
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto">
            {slogan}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sobre"
              className="bg-accent hover:opacity-90 px-8 py-3 rounded-md font-bold transition-all text-white"
            >
              Conheça o Projeto
            </Link>
            <Link
              href="/publicacoes"
              className="border-2 border-white hover:bg-white hover:text-dark px-8 py-3 rounded-md font-bold transition-all"
            >
              Publicações
            </Link>
          </div>
        </div>
      </section>

      {/* Eixos de Atuação */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-dark mb-2">Eixos de Atuação</h2>
          <p className="text-neutral-text max-w-2xl mx-auto">
            O PELD Iguaçu organiza suas pesquisas em quatro frentes integradas para
            compreender a dinâmica do ecossistema.
          </p>
        </div>

        {eixos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {eixos.map((eixo) => {
              const iconUrl = strapiMediaUrl(eixo.icone);
              return (
                <div
                  key={eixo.id}
                  className="group relative bg-white p-8 pt-12 rounded-tr-[40px] rounded-bl-[40px] rounded-tl-lg rounded-br-lg shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="absolute -top-6 left-8 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: eixo.cor || "#1A9E96" }}
                  >
                    {iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={iconUrl} alt="" className="w-7 h-7 object-contain" />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {eixo.nome.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3 mt-2">{eixo.nome}</h3>
                  <p className="text-neutral-text text-sm leading-relaxed">
                    {eixo.descricao_curta}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-neutral-text text-sm">
            Cadastre os eixos no Strapi (Content Manager → Eixo) para exibi-los aqui.
          </p>
        )}
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="py-20 bg-surface px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-dark mb-12">Destaques Recentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destaques.slice(0, 3).map((noticia) => {
                const img = strapiMediaUrl(noticia.imagem);
                return (
                  <div
                    key={noticia.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {img && (
                      <div className="aspect-video overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-dark mb-2">
                        {noticia.titulo}
                      </h3>
                      {noticia.resumo && (
                        <p className="text-sm text-neutral-text">{noticia.resumo}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
