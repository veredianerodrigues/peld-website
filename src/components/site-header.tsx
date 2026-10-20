"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import logo from "../../public/peld-logo.png";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image src={logo} alt="PELD Iguaçu" className="h-9 md:h-10 w-auto" preload />
        </Link>

        <nav aria-label="Principal" className="hidden xl:flex items-center gap-x-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors",
                isActive(item.href) ? "text-primary" : "text-foreground/80 hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="xl:hidden p-2 -mr-2 text-foreground"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="xl:hidden border-t border-border px-4 py-3 flex flex-col"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                isActive(item.href) ? "text-primary" : "text-foreground/80 hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
