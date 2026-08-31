import Image from "next/image";
import Link from "next/link";
import logo from "../../public/peld-logo.png";
import { NAV_ITEMS } from "@/lib/nav";
import { PARCEIROS } from "@/lib/partners";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <Image
            src={logo}
            alt="PELD Iguaçu"
            className="h-10 w-auto brightness-0 invert opacity-90 mb-4"
          />
          <p className="text-sm text-background/70 leading-relaxed">
            Programa de Pesquisa Ecológica de Longa Duração no Parque Nacional
            do Iguaçu.
          </p>
        </div>

        <div>
          <h4 className="text-background mb-4">Links Rápidos</h4>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.filter((item) => item.href !== "/").map((item) => (
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

        <div>
          <h4 className="text-background mb-4">Contato</h4>
          <ul className="flex flex-col gap-2 text-sm text-background/70">
            <li>Parque Nacional do Iguaçu, Foz do Iguaçu – PR</li>
            <li>contato@peldiguacu.org</li>
            <li>+55 (45) 3000-0000</li>
          </ul>
        </div>

        <div>
          <h4 className="text-background mb-4">Apoio Institucional</h4>
          <ul className="flex flex-col gap-2 text-sm text-background/70">
            {PARCEIROS.map((nome) => (
              <li key={nome}>{nome}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-background/15">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/60">
          <span>© {year} PELD Iguaçu. Todos os direitos reservados.</span>
          <span>Programa de Pesquisa Ecológica de Longa Duração</span>
        </div>
      </div>
    </footer>
  );
}
