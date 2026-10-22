import Image from "next/image";
import Link from "next/link";
import { HeartPulse, Leaf, MessagesSquare, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/patterns/section-title";
import { AxisCard } from "@/components/patterns/axis-card";
import { formatDate } from "@/lib/format";
import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";

interface HomePageData {
  slogan?: string;
  imagem_fundo?: StrapiMedia | null;
}

interface Eixo {
  id: number;
  nome: string;
  descricao_curta: string;
  icone?: StrapiMedia | null;
  cor?: string;
}

interface Noticia {
  id: number;
  titulo: string;
  slug?: string | null;
  resumo?: string;
  imagem?: StrapiMedia | null;
  data: string;
}

interface ItemApoio {
  id: number;
  nome: string;
  logo?: StrapiMedia | null;
  link?: string | null;
}

interface SecaoApoio {
  titulo: string;
  itens?: ItemApoio[];
}

const SLOGAN_PADRAO = "Ciência, conservação e educação no Parque Nacional do Iguaçu.";

// Ícone padrão por posição do eixo, usado enquanto o eixo não tem ícone próprio.
const ICONES_EIXO: LucideIcon[] = [Leaf, HeartPulse, Users, MessagesSquare];
const CORES_EIXO = ["var(--foreground)", "var(--primary)", "var(--muted-foreground)", "var(--accent)"];

async function getHomeData() {
  const [home, eixos, destaques, apoio] = await Promise.all([
    fetchStrapi<HomePageData>("/home-page", { populate: "imagem_fundo" }),
    fetchStrapi<Eixo[]>("/eixos", { populate: "icone", sort: "ordem:asc" }),
    fetchStrapi<Noticia[]>("/noticias", {
      "filters[destaque][$eq]": "true",
      populate: "imagem",
      sort: "data:desc",
      "pagination[limit]": "3",
    }),
    fetchStrapi<SecaoApoio>("/secao-apoio", { "populate[itens][populate]": "logo" }),
  ]);
  return { home, eixos: eixos ?? [], destaques: destaques ?? [], apoio };
}

export default async function HomePage() {
  const { home, eixos, destaques, apoio } = await getHomeData();
  const itensApoio = apoio?.itens ?? [];
  const heroUrl = strapiMediaUrl(home?.imagem_fundo) ?? "/images/hero-cataratas.jpg";
  const [destaque, ...outros] = destaques;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-128 items-center justify-center overflow-hidden px-4 text-center md:min-h-160">
        <Image
          src={heroUrl}
          alt={home?.imagem_fundo?.alternativeText ?? "Vista das Cataratas do Iguaçu"}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-foreground/95 via-foreground/70 to-foreground/40"
        />

        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-5 py-20 md:gap-6 md:py-28">
          <span className="text-xs font-bold uppercase tracking-wider text-background/90">
            Programa de Pesquisa Ecológica de Longa Duração
          </span>
          <h1 className="text-5xl text-background md:text-7xl">PELD Iguaçu</h1>
          <p className="max-w-xl text-lg text-background/90 md:text-xl">
            {home?.slogan || SLOGAN_PADRAO}
          </p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button asChild variant="accent" size="lg">
              <Link href="/sobre">Conheça o Projeto</Link>
            </Button>
            {/* Outline padrão (teal) some sobre o overlay escuro: aqui a borda vai em branco. */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background text-background hover:bg-background hover:text-foreground"
            >
              <Link href="/publicacoes">Publicações</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Eixos de Atuação */}
      {eixos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <SectionTitle
            title="Eixos de Atuação"
            subtitle="O PELD Iguaçu organiza suas pesquisas em quatro frentes integradas para compreender a dinâmica do Parque Nacional do Iguaçu."
            centered
          />
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            {eixos.map((eixo, i) => (
              <Link key={eixo.id} href="/pesquisa" className="block">
                <AxisCard
                  title={eixo.nome}
                  description={eixo.descricao_curta}
                  icon={ICONES_EIXO[i % ICONES_EIXO.length]}
                  iconUrl={strapiMediaUrl(eixo.icone)}
                  color={eixo.cor || CORES_EIXO[i % CORES_EIXO.length]}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Destaques — notícias marcadas como destaque */}
      {destaque && (
        <section className="bg-muted px-4 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              title="Destaques"
              subtitle="Últimas notícias do PELD Iguaçu."
              className="[&_p]:mx-0"
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <Link href={destaque.slug ? `/noticias/${destaque.slug}` : "/noticias"} className="group block rounded-xl">
                <Card className="h-full gap-0 overflow-hidden">
                  {strapiMediaUrl(destaque.imagem) && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={strapiMediaUrl(destaque.imagem)!}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <time
                      dateTime={destaque.data}
                      className="mb-2 block text-xs font-semibold uppercase tracking-wide text-primary"
                    >
                      {formatDate(destaque.data)}
                    </time>
                    <h3 className="mb-2 text-foreground transition-colors group-hover:text-primary md:text-2xl">
                      {destaque.titulo}
                    </h3>
                    {destaque.resumo && (
                      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        {destaque.resumo}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>

              {outros.length > 0 && (
                <div className="flex flex-col gap-6">
                  {outros.map((post) => {
                    const img = strapiMediaUrl(post.imagem);
                    return (
                      <Link key={post.id} href={post.slug ? `/noticias/${post.slug}` : "/noticias"} className="group block flex-1 rounded-xl">
                        <Card className="h-full flex-row gap-0 overflow-hidden">
                          {img && (
                            <div className="relative w-28 shrink-0 overflow-hidden sm:w-44">
                              <Image
                                src={img}
                                alt=""
                                fill
                                sizes="(min-width: 640px) 176px, 112px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <CardContent className="flex flex-1 flex-col justify-center p-4 sm:p-6">
                            <time
                              dateTime={post.data}
                              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary"
                            >
                              {formatDate(post.data)}
                            </time>
                            <h4 className="mb-1 text-base text-foreground transition-colors group-hover:text-primary sm:text-lg">
                              {post.titulo}
                            </h4>
                            {post.resumo && (
                              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                {post.resumo}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Apoio */}
      {itensApoio.length > 0 && (
        <section aria-labelledby="parceiros-titulo" className="border-t border-border px-4 py-12 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h2
              id="parceiros-titulo"
              className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              {apoio?.titulo}
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
              {itensApoio.map((item) => {
                const logoUrl = strapiMediaUrl(item.logo);
                const conteudo = logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={item.nome} className="h-12 w-auto object-contain md:h-14" />
                ) : (
                  <span className="text-xl font-bold tracking-wide text-muted-foreground md:text-2xl">
                    {item.nome}
                  </span>
                );
                return (
                  <li
                    key={item.id}
                    className="opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  >
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {conteudo}
                      </a>
                    ) : (
                      conteudo
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
