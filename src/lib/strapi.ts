const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

/** Resolve a URL de mídia do Strapi (relativa) para uma URL absoluta. */
export function strapiMediaUrl(media?: StrapiMedia | null): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

/**
 * Fetch tipado para a REST API do Strapi.
 * `path` já inclui a barra inicial, ex: "/noticias".
 * Revalida a cada 60s (ISR) por padrão.
 */
export async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>
): Promise<T | null> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  try {
    const res = await fetch(`${STRAPI_URL}/api${path}${query}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // 404 é esperado quando o conteúdo ainda não foi cadastrado no Strapi
      // (ex: single type sem entrada criada) — não é um erro de verdade.
      if (res.status !== 404) {
        console.error(`Strapi fetch failed (${res.status}): ${path}`);
      }
      return null;
    }

    const json: StrapiResponse<T> = await res.json();
    return json.data;
  } catch (err) {
    console.error(`Strapi fetch error: ${path}`, err);
    return null;
  }
}
