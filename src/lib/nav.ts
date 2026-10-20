export interface NavItem {
  href: string;
  label: string;
}

// Home fica acessível pelo logo.
export const NAV_ITEMS: NavItem[] = [
  { href: "/sobre", label: "Sobre" },
  { href: "/pesquisa", label: "Pesquisa" },
  { href: "/fopea", label: "Educação e Engajamento" },
  { href: "/dados", label: "Dados" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/noticias", label: "Notícias e Eventos" },
  { href: "/instituicoes", label: "Instituições Participantes" },
  { href: "/contato", label: "Contato" },
];
