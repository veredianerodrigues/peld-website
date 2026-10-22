import Image from "next/image";
import Link from "next/link";
import logo from "../../public/peld-logo.png";
import { NAV_ITEMS } from "@/lib/nav";
import { getConfiguracaoGlobal, getInstituicoes, TEXTO_FOOTER_PADRAO } from "@/lib/partners";
import { strapiMediaUrl } from "@/lib/strapi";
import { NOME_REDE, SocialIcon } from "@/components/icons";

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const [config, instituicoes] = await Promise.all([getConfiguracaoGlobal(), getInstituicoes()]);
  const textoFooter = config?.texto_footer || TEXTO_FOOTER_PADRAO;

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <Image
            src={logo}
            alt="PELD Iguaçu"
            className="h-10 w-auto brightness-0 invert opacity-90 mb-4"
          />
          <p className="text-sm text-background/70 leading-relaxed">{textoFooter}</p>
        </div>

        <div>
          <h4 className="text-background mb-4">Links Rápidos</h4>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-background/70 hover:text-background transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {(config?.footer_localidade || config?.footer_email || config?.redes_sociais?.length) && (
          <div>
            <h4 className="text-background mb-4">Contato</h4>
            <ul className="flex flex-col gap-2 text-sm text-background/70">
              {config.footer_localidade && <li>{config.footer_localidade}</li>}
              {config.footer_email && (
                <li>
                  <a href={`mailto:${config.footer_email}`} className="hover:text-background">
                    {config.footer_email}
                  </a>
                </li>
              )}
            </ul>
            {!!config.redes_sociais?.length && (
              <ul className="flex flex-wrap gap-3 mt-4">
                {config.redes_sociais.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={r.usuario ? `${NOME_REDE[r.rede]}: ${r.usuario}` : NOME_REDE[r.rede]}
                      className="flex size-9 items-center justify-center rounded-full bg-background/10 text-background/80 hover:bg-background/20 hover:text-background"
                    >
                      <SocialIcon rede={r.rede} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {instituicoes.length > 0 && (
          <div>
            <h4 className="text-background mb-4">Apoio</h4>
            <ul className="grid grid-cols-3 gap-3">
              {instituicoes.map((inst) => {
                const logoUrl = strapiMediaUrl(inst.logo);
                return (
                  <li
                    key={inst.id}
                    className="flex h-14 items-center justify-center rounded-md bg-background p-2"
                  >
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logoUrl} alt={inst.nome} className="max-h-full w-auto object-contain" />
                    ) : (
                      <span className="text-center text-xs font-bold text-foreground">{inst.nome}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-background/15">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/60">
          <span>© {year} PELD Iguaçu. Todos os direitos reservados.</span>
          <span>{textoFooter}</span>
        </div>
      </div>
    </footer>
  );
}
