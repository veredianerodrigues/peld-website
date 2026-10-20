import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";
import { PageHeader } from "@/components/PageHeader";

interface Instituicao {
  id: number;
  nome: string;
  logo?: StrapiMedia | null;
  link?: string;
  descricao?: string;
}

async function getInstituicoes() {
  const data = await fetchStrapi<Instituicao[]>("/instituicoes", {
    populate: "logo",
    sort: "ordem:asc",
  });
  return data ?? [];
}

export default async function InstituicoesPage() {
  const instituicoes = await getInstituicoes();

  return (
    <div className="pb-20">
      <PageHeader
        title="Instituições Participantes"
        description="Instituições que apoiam e viabilizam o PELD Iguaçu."
      />

      <section className="max-w-7xl mx-auto px-4">
        {instituicoes.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Cadastre instituições no Strapi (Content Manager → Instituição) para exibi-las aqui.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instituicoes.map((inst) => {
              const logoUrl = strapiMediaUrl(inst.logo);
              const content = (
                <div className="flex flex-col items-center text-center p-8 bg-card rounded-lg border border-border h-full">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt={inst.nome}
                      className="h-16 w-auto object-contain mb-4"
                    />
                  ) : (
                    <div className="h-16 flex items-center justify-center font-bold text-foreground mb-4">
                      {inst.nome}
                    </div>
                  )}
                  <h3 className="font-bold text-foreground mb-1">{inst.nome}</h3>
                  {inst.descricao && (
                    <p className="text-sm text-muted-foreground">{inst.descricao}</p>
                  )}
                </div>
              );
              return inst.link ? (
                <a key={inst.id} href={inst.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={inst.id}>{content}</div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
