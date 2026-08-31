export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/pesquisa", label: "Pesquisa" },
  { href: "/fopea", label: "Educação" },
  { href: "/publicacoes", label: "Dados" },
  { href: "/noticias", label: "Notícias" },
  { href: "/contato", label: "Contato" },
];
