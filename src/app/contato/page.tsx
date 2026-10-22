import { fetchStrapi } from "@/lib/strapi";
import { getConfiguracaoGlobal } from "@/lib/partners";
import { PageHeader } from "@/components/PageHeader";
import { MaterialIcon, NOME_REDE, SocialIcon } from "@/components/icons";

interface ContatoPageData {
  introducao?: string;
}

async function getContatoData() {
  const [contato, config] = await Promise.all([
    fetchStrapi<ContatoPageData>("/contato-page"),
    getConfiguracaoGlobal(),
  ]);
  return { contato, config };
}

export default async function ContatoPage() {
  const { contato, config } = await getContatoData();
  const redes = config?.redes_sociais ?? [];
  const temContato = Boolean(config?.footer_localidade || config?.footer_email || redes.length);

  return (
    <div className="pb-20">
      <PageHeader
        title="Contato"
        description={contato?.introducao ?? "Fale com a equipe do PELD Iguaçu."}
      />

      <section className="max-w-7xl mx-auto px-4">
        {!temContato && <p className="text-muted-foreground text-sm">Em breve.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config?.footer_localidade && (
            <div className="flex gap-4 p-6 bg-card border border-border rounded-xl">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <MaterialIcon name="location_on" className="text-[1.5rem]" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Endereço</h2>
                <p className="text-foreground mt-1 whitespace-pre-line">{config.footer_localidade}</p>
              </div>
            </div>
          )}

          {config?.footer_email && (
            <div className="flex gap-4 p-6 bg-card border border-border rounded-xl">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <MaterialIcon name="mail" className="text-[1.5rem]" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold uppercase tracking-wide text-primary">E-mail</h2>
                <a
                  href={`mailto:${config.footer_email}`}
                  className="text-foreground mt-1 block break-all hover:text-primary hover:underline"
                >
                  {config.footer_email}
                </a>
              </div>
            </div>
          )}
        </div>

        {redes.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground mb-4">Redes sociais</h2>
            <ul className="flex flex-wrap gap-3">
              {redes.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-full text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <SocialIcon rede={r.rede} />
                    <span className="font-semibold">{r.usuario || NOME_REDE[r.rede]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
