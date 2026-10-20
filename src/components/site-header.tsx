"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/peld-logo.png";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col items-center gap-3">
        <Link href="/" className="shrink-0">
          <Image
            src={logo}
            alt="PELD Iguaçu"
            className="h-12 md:h-14 w-auto"
            preload
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:gap-x-7">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-semibold uppercase tracking-wide transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
