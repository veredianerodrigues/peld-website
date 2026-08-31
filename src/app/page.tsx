import Image from "next/image";
import Link from "next/link";
import { BarChart3, HeartPulse, Leaf, Users } from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { SectionTitle } from "@/patterns/section-title";
import { AxisCard } from "@/patterns/axis-card";
import { PARCEIROS } from "@/lib/partners";

const EIXOS = [
  {
    title: "Biodiversidade",
    description:
      "Monitoramento de fauna, flora e a dinâmica das comunidades biológicas ao longo do tempo.",
    icon: Leaf,
    color: "#1A9E96",
  },
  {
    title: "Saúde Ambiental",
    description:
      "Avaliação da qualidade da água, do solo e do ar, e dos impactos das pressões antrópicas no ecossistema.",
    icon: HeartPulse,
    color: "#E8943A",
  },
  {
    title: "Socioecológico",
    description:
      "Relações entre comunidades locais, visitantes e a conservação do Parque Nacional do Iguaçu.",
    icon: Users,
    color: "#0D4D4A",
  },
  {
    title: "Análises Integrativas",
    description:
      "Modelagem e síntese de dados de longo prazo para orientar decisões de manejo e conservação.",
    icon: BarChart3,
    color: "#1A9E96",
  },
];

const DESTAQUES = [
  {
    title: "Novo levantamento revela aumento na diversidade de aves no Parque",
    excerpt:
      "Dados coletados ao longo de três anos mostram recuperação de espécies sensíveis em áreas de restauração florestal.",
    date: new Date("2026-08-10"),
    image: "/images/destaque-1.jpg",
    href: "/noticias",
  },
  {
    title: "PELD Iguaçu participa de encontro nacional de pesquisa ecológica",
    excerpt:
      "Equipe apresentou resultados preliminares do eixo Socioecológico em Brasília.",
    date: new Date("2026-07-22"),
    image: "/images/destaque-2.jpg",
    href: "/noticias",
  },
  {
    title: "Publicação avalia qualidade da água em afluentes do Iguaçu",
    excerpt:
      "Novo artigo do eixo Saúde Ambiental está disponível na seção de publicações.",
    date: new Date("2026-07-05"),
    image: "/images/destaque-3.jpg",
    href: "/publicacoes",
  },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function HomePage() {
  const [destaque, ...outros] = DESTAQUES;

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative flex min-h-140 md:min-h-160 items-center justify-center overflow-hidden px-4 text-center">
          <Image
            src="/images/hero-cataratas.jpg"
            alt="Cataratas do Iguaçu"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/95 via-foreground/65 to-foreground/40" />

          <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6 py-24">
            <Badge variant="secondary">
              Programa de Pesquisa Ecológica de Longa Duração
            </Badge>
            <h1 className="text-5xl md:text-7xl text-background">
              PELD Iguaçu
            </h1>
            <p className="max-w-xl text-lg md:text-xl font-light text-background/90">
              Ciência, conservação e educação no Parque Nacional do Iguaçu.
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link href="/sobre">Conheça o Projeto</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/publicacoes">Publicações</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Eixos de Atuação */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          title="Eixos de Atuação"
          subtitle="O PELD Iguaçu organiza suas pesquisas em quatro frentes integradas para compreender a dinâmica do Parque Nacional do Iguaçu."
          centered
        />
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {EIXOS.map((eixo) => (
            <AxisCard
              key={eixo.title}
              icon={eixo.icon}
              title={eixo.title}
              description={eixo.description}
              color={eixo.color}
            />
          ))}
        </div>
      </section>

      {/* Destaques Recentes */}
      <section className="bg-muted px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            title="Destaques Recentes"
            subtitle="Últimas notícias e publicações do PELD Iguaçu."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Link href={destaque.href} className="group block">
              <Card className="h-full gap-0 overflow-hidden py-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={destaque.image}
                    alt={destaque.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    {formatDate(destaque.date)}
                  </p>
                  <h3 className="mb-2 text-foreground transition-colors group-hover:text-primary">
                    {destaque.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {destaque.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <div className="flex flex-col gap-6">
              {outros.map((post) => (
                <Link key={post.title} href={post.href} className="group block">
                  <Card className="gap-0 overflow-hidden py-0">
                    <div className="flex flex-row">
                      <div className="relative aspect-square w-32 shrink-0 overflow-hidden sm:w-40">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="160px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="flex-1 p-4 sm:p-5">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          {formatDate(post.date)}
                        </p>
                        <h4 className="mb-1 text-foreground transition-colors group-hover:text-primary">
                          {post.title}
                        </h4>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Parceiros e Apoio Institucional
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {PARCEIROS.map((nome) => (
              <span
                key={nome}
                className="grayscale text-lg font-bold tracking-wide text-muted-foreground opacity-70 transition-opacity hover:opacity-100 md:text-xl"
              >
                {nome}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
