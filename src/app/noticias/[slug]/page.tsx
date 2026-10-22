import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { formatDate } from "@/lib/format";
import { BlocksContent, type Block } from "@/components/BlocksContent";

interface Fonte {
  id: number;
  titulo: string;
  url?: string | null;
}

interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  resumo?: string | null;
  corpo?: Block[] | null;
  imagem?: StrapiMedia | null;
  data: string;
  fontes?: Fonte[] | null;
}

async function getNoticia(slug: string) {
  const data = await fetchStrapi<Noticia[]>("/noticias", {
    "filters[slug][$eq]": slug,
    "populate[0]": "imagem",
    "populate[1]": "fontes",
    "pagination[limit]": "1",
  });
  return data?.[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const noticia = await getNoticia((await params).slug);
  if (!noticia) return {};
  return { title: noticia.titulo, description: noticia.resumo ?? undefined };
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const noticia = await getNoticia((await params).slug);
  if (!noticia) notFound();

  const img = strapiMediaUrl(noticia.imagem);
  const fontes = noticia.fontes ?? [];

  return (
    <article className="pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/noticias" className="text-sm font-semibold text-primary hover:underline">
          ← Notícias e Eventos
        </Link>

        <header className="mt-6 mb-8">
          <time dateTime={noticia.data} className="text-xs text-primary font-bold uppercase">
            {formatDate(noticia.data)}
          </time>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mt-2 text-balance">
            {noticia.titulo}
          </h1>
          {noticia.resumo && (
            <p className="text-lg text-muted-foreground mt-4 leading-relaxed">{noticia.resumo}</p>
          )}
        </header>
      </div>

      {img && (
        <div className="max-w-5xl mx-auto px-4 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={noticia.imagem?.alternativeText || noticia.titulo}
            className="w-full max-h-[32rem] object-cover rounded-xl"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        <BlocksContent content={noticia.corpo} className="text-foreground/90 leading-relaxed text-lg" />

        {fontes.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-border">
            <h2 className="text-sm font-bold text-foreground mb-2">
              {fontes.length > 1 ? "Fontes" : "Fonte"} — matéria original
            </h2>
            <ul className="space-y-1 text-sm">
              {fontes.map((f) => (
                <li key={f.id}>
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      {f.titulo}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">{f.titulo}</span>
                  )}
                </li>
              ))}
            </ul>
          </footer>
        )}
      </div>
    </article>
  );
}
