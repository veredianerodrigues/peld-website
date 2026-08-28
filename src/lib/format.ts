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
