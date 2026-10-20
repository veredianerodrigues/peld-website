import Image from "next/image";
import Link from "next/link";
import { BarChart3, HeartPulse, Leaf, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/patterns/section-title";
import { AxisCard } from "@/components/patterns/axis-card";
import { formatDate } from "@/lib/format";
import { PARCEIROS } from "@/lib/partners";

// Cada eixo usa um token de cor do globals.css — nada de hex solto.
const EIXOS = [
  {
    title: "Biodiversidade",
    description:
      "Monitoramento de fauna, flora e da dinâmica das comunidades biológicas ao longo do tempo.",
    icon: Leaf,
    color: "var(--primary)",
  },
  {
    title: "Saúde Ambiental",
    description:
      "Qualidade da água, do solo e do ar, e os impactos das pressões humanas sobre o ecossistema.",
    icon: HeartPulse,
    color: "var(--accent)",
  },
  {
    title: "Socioecológico",
    description:
      "Relações entre comunidades locais, visitantes e a conservação do Parque Nacional do Iguaçu.",
    icon: Users,
    color: "var(--foreground)",
  },
  {
    title: "Análises Integrativas",
    description:
      "Modelagem e síntese de dados de longo prazo para orientar o manejo e a conservação.",
    icon: BarChart3,
    color: "var(--muted-foreground)",
  },
];

const DESTAQUES = [
  {
    title: "Novo levantamento revela aumento na diversidade de aves no Parque",
    excerpt:
      "Dados coletados ao longo de três anos mostram a recuperação de espécies sensíveis em áreas de restauração florestal.",
    date: "2026-08-10",
    image: "/images/destaque-1.jpg",
    href: "/noticias",
  },
  {
    title: "PELD Iguaçu participa de encontro nacional de pesquisa ecológica",
    excerpt:
      "Equipe apresentou resultados preliminares do eixo Socioecológico em Brasília.",
    date: "2026-07-22",
    image: "/images/destaque-2.jpg",
    href: "/noticias",
  },
  {
    title: "Publicação avalia a qualidade da água em afluentes do Iguaçu",
    excerpt:
      "Novo artigo do eixo Saúde Ambiental está disponível na seção de publicações.",
    date: "2026-07-05",
    image: "/images/destaque-3.jpg",
    href: "/publicacoes",
  },
];

export default function HomePage() {
  const [destaque, ...outros] = DESTAQUES;

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-128 items-center justify-center overflow-hidden px-4 text-center md:min-h-160">
        <Image
          src="/images/hero-cataratas.jpg"
          alt="Vista das Cataratas do Iguaçu"
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
          <Badge variant="secondary" className="whitespace-normal text-center">
            Programa de Pesquisa Ecológica de Longa Duração
          </Badge>
          <h1 className="text-5xl text-background md:text-7xl">PELD Iguaçu</h1>
          <p className="max-w-xl text-lg text-background/90 md:text-xl">
            Ciência, conservação e educação no Parque Nacional do Iguaçu.
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
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <SectionTitle
          title="Eixos de Atuação"
          subtitle="O PELD Iguaçu organiza suas pesquisas em quatro frentes integradas para compreender a dinâmica do Parque Nacional do Iguaçu."
          centered
        />
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {EIXOS.map((eixo) => (
            <AxisCard key={eixo.title} {...eixo} />
          ))}
        </div>
      </section>

      {/* Destaques Recentes */}
      <section className="bg-muted px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            title="Destaques Recentes"
            subtitle="Últimas notícias e publicações do PELD Iguaçu."
            className="[&_p]:mx-0"
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <Link href={destaque.href} className="group block rounded-xl">
              <Card className="h-full gap-0 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={destaque.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <time
                    dateTime={destaque.date}
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-primary"
                  >
                    {formatDate(destaque.date)}
                  </time>
                  <h3 className="mb-2 text-foreground transition-colors group-hover:text-primary md:text-2xl">
                    {destaque.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {destaque.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <div className="flex flex-col gap-6">
              {outros.map((post) => (
                <Link key={post.title} href={post.href} className="group block flex-1 rounded-xl">
                  <Card className="h-full flex-row gap-0 overflow-hidden">
                    <div className="relative w-28 shrink-0 overflow-hidden sm:w-44">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 176px, 112px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="flex flex-1 flex-col justify-center p-4 sm:p-6">
                      <time
                        dateTime={post.date}
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary"
                      >
                        {formatDate(post.date)}
                      </time>
                      <h4 className="mb-1 text-base text-foreground transition-colors group-hover:text-primary sm:text-lg">
                        {post.title}
                      </h4>
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section aria-labelledby="parceiros-titulo" className="border-t border-border px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h2
            id="parceiros-titulo"
            className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            Parceiros e Apoio Institucional
          </h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
            {PARCEIROS.map((nome) => (
              <li
                key={nome}
                className="text-xl font-bold tracking-wide text-muted-foreground opacity-70 grayscale transition-opacity hover:opacity-100 md:text-2xl"
              >
                {nome}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
