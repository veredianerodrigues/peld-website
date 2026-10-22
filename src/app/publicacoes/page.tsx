import { Fragment, type ReactNode } from "react";
import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { RichText } from "@/components/RichText";
import { PageHeader } from "@/components/PageHeader";

interface PublicacoesPageData {
  introducao?: string;
  ebook_titulo?: string | null;
  ebook_descricao?: string | null;
  ebook_capa?: StrapiMedia | null;
  ebook_link?: string | null;
  ebook_arquivo?: StrapiMedia | null;
}

type TipoPublicacao = "artigo_cientifico" | "livro_capitulo_guia";

interface Publicacao {
  id: number;
  titulo: string;
  tipo?: TipoPublicacao | null;
  periodico?: string | null;
  ano?: number | null;
  link?: string | null;
  dossie?: string | null;
  autores?: string | null;
  resumo?: string | null;
  arquivo?: StrapiMedia | null;
}

async function getPublicacoesData() {
  const [pagina, publicacoes] = await Promise.all([
    fetchStrapi<PublicacoesPageData>("/publicacoes-page", {
      "populate[0]": "ebook_capa",
      "populate[1]": "ebook_arquivo",
    }),
    fetchStrapi<Publicacao[]>("/publicacoes", {
      populate: "arquivo",
      "sort[0]": "ano:desc",
      "sort[1]": "titulo:asc",
      "pagination[pageSize]": "200",
    }),
  ]);
  return { pagina, publicacoes: publicacoes ?? [] };
}

/** Renderiza trechos entre *asteriscos* em itálico (nomes científicos nos títulos). */
function withItalics(text: string): ReactNode {
  return text.split(/\*([^*]+)\*/g).map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>
  );
}

function groupBy<T>(items: T[], key: (item: T) => string): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return [...groups.entries()];
}

function PublicacaoItem({ pub }: { pub: Publicacao }) {
  const href = pub.link || strapiMediaUrl(pub.arquivo);
  const fonte = [pub.periodico, pub.ano].filter(Boolean).join(" — ");
  return (
    <article className="py-5 border-b border-border last:border-b-0">
      <h4 className="font-bold text-foreground leading-snug">{withItalics(pub.titulo)}</h4>
      {pub.autores && <p className="text-sm text-muted-foreground mt-1">{pub.autores}</p>}
      {fonte && <p className="text-sm text-muted-foreground italic mt-1">{fonte}</p>}
      {pub.resumo && <p className="text-sm text-muted-foreground mt-2">{pub.resumo}</p>}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
        >
          {pub.tipo === "livro_capitulo_guia" ? "Acessar publicação" : "Leia o artigo"} →
        </a>
      )}
    </article>
  );
}

/** Lista com sub-blocos de dossiê: itens com o mesmo `dossie` ficam agrupados sob o título dele. */
function ListaComDossies({ itens }: { itens: Publicacao[] }) {
  const avulsos = itens.filter((p) => !p.dossie);
  const dossies = groupBy(
    itens.filter((p) => p.dossie),
    (p) => p.dossie as string
  );
  return (
    <>
      {avulsos.map((pub) => (
        <PublicacaoItem key={pub.id} pub={pub} />
      ))}
      {dossies.map(([titulo, pubs]) => (
        <div key={titulo} className="mt-8">
          <h4 className="text-base font-bold text-foreground bg-secondary rounded px-4 py-3">
            {titulo}
          </h4>
          <div className="pl-4 border-l-2 border-primary ml-4">
            {pubs.map((pub) => (
              <PublicacaoItem key={pub.id} pub={pub} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default async function PublicacoesPage() {
  const { pagina, publicacoes } = await getPublicacoesData();

  const ebookCapa = strapiMediaUrl(pagina?.ebook_capa);
  const ebookHref = pagina?.ebook_link || strapiMediaUrl(pagina?.ebook_arquivo);

  const artigos = publicacoes.filter((p) => (p.tipo ?? "artigo_cientifico") === "artigo_cientifico");
  const livros = publicacoes.filter((p) => p.tipo === "livro_capitulo_guia");
  const artigosPorAno = groupBy(artigos, (p) => (p.ano ? String(p.ano) : "Outros"));

  return (
    <div className="pb-20">
      <PageHeader title="Publicações" description="Publicações científicas do PELD Iguaçu." />

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {pagina?.introducao && (
          <section>
            <RichText className="text-muted-foreground leading-relaxed">{pagina.introducao}</RichText>
          </section>
        )}

        {pagina?.ebook_titulo && (
          <section className="flex flex-col sm:flex-row gap-6 p-6 bg-secondary rounded-lg">
            {ebookCapa && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ebookCapa}
                alt={pagina.ebook_capa?.alternativeText || `Capa do e-book ${pagina.ebook_titulo}`}
                className="w-40 shrink-0 self-start rounded shadow-md object-cover"
              />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">E-book</span>
              <h2 className="text-xl font-bold text-foreground mt-2 leading-snug">
                {pagina.ebook_titulo}
              </h2>
              {pagina.ebook_descricao && (
                <p className="text-muted-foreground mt-3">{pagina.ebook_descricao}</p>
              )}
              {ebookHref && (
                <a
                  href={ebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
                >
                  Acesse o e-book
                </a>
              )}
            </div>
          </section>
        )}

        {publicacoes.length === 0 && !pagina?.ebook_titulo && (
          <p className="text-center text-muted-foreground text-sm">
            Nenhuma publicação disponível no momento.
          </p>
        )}

        {artigos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Artigos científicos</h2>
            <div className="space-y-10">
              {artigosPorAno.map(([ano, itens]) => (
                <div key={ano}>
                  <h3 className="text-lg font-bold text-primary border-b-2 border-primary pb-2">
                    {ano}
                  </h3>
                  <ListaComDossies itens={itens} />
                </div>
              ))}
            </div>
          </section>
        )}

        {livros.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Livros, capítulos e guias</h2>
            <ListaComDossies itens={livros} />
          </section>
        )}
      </div>
    </div>
  );
}
