/** Divide um texto (richtext markdown simples) em parágrafos. */
export function splitParagraphs(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export interface BlockNode {
  type: string;
  children?: { text?: string }[];
}

/** Extrai texto plano de um campo "blocks" do Strapi, em parágrafos. */
export function blocksToParagraphs(blocks?: BlockNode[] | null): string[] {
  if (!blocks) return [];
  return blocks
    .map((block) => (block.children ?? []).map((c) => c.text ?? "").join(""))
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Data atual (YYYY-MM-DD) no fuso de Brasília, comparável com campos `date` do Strapi. */
export function todayISO(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
}

/** Intervalo compacto via Intl.formatRange, ex.: "12 – 15 de mar. de 2026". */
export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!end || end === start) return formatDate(start);
  const from = new Date(`${start}T00:00:00`);
  const to = new Date(`${end}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return formatDate(start);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatRange(from, to);
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
