import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { fetchStrapi, strapiMediaUrl, type StrapiMedia } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "PELD Iguaçu",
  description:
    "Pesquisas Ecológicas de Longa Duração no Parque Nacional do Iguaçu",
};

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/pesquisa", label: "Pesquisa" },
  { href: "/fopea", label: "FOPEA" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/noticias", label: "Notícias e Eventos" },
  { href: "/instituicoes", label: "Instituições Participantes" },
  { href: "/contato", label: "Contato" },
];

interface ConfiguracaoGlobal {
  logo?: StrapiMedia | null;
  texto_footer: string;
  footer_localidade?: string;
  footer_email?: string;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const config = await fetchStrapi<ConfiguracaoGlobal>("/configuracao-global", {
    populate: "logo",
  });
  const logoUrl = strapiMediaUrl(config?.logo);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="PELD Iguaçu"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="font-bold text-dark">PELD Iguaçu</span>
            )}
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-bold uppercase tracking-wide text-dark hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-dark text-white py-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 text-sm text-white/70">
            <p>
              {config?.texto_footer ??
                "Pesquisas Ecológicas de Longa Duração no Parque Nacional do Iguaçu"}
            </p>
            <div className="flex flex-wrap gap-6">
              {config?.footer_localidade && <span>{config.footer_localidade}</span>}
              {config?.footer_email && <span>{config.footer_email}</span>}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
