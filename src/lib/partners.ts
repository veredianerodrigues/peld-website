import { fetchStrapi, type StrapiMedia } from "@/lib/strapi";

export interface Instituicao {
  id: number;
  nome: string;
  logo?: StrapiMedia | null;
  link?: string;
  descricao?: string;
}

/** Instituições cadastradas — fonte única para rodapé, Home e página de Instituições. */
export async function getInstituicoes() {
  const data = await fetchStrapi<Instituicao[]>("/instituicoes", {
    populate: "logo",
    sort: "ordem:asc",
  });
  return data ?? [];
}

export interface ConfiguracaoGlobal {
  texto_footer?: string;
  footer_localidade?: string;
  footer_email?: string;
}

export function getConfiguracaoGlobal() {
  return fetchStrapi<ConfiguracaoGlobal>("/configuracao-global");
}

export const TEXTO_FOOTER_PADRAO =
  "Pesquisas Ecológicas de Longa Duração no Parque Nacional do Iguaçu";
