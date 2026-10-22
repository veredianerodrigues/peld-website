import Markdown from "react-markdown";

/**
 * Renderiza campos richtext (markdown) do Strapi: parágrafos, listas, negrito,
 * itálico e títulos. HTML bruto é ignorado (padrão do react-markdown).
 */
export function RichText({ children, className = "" }: { children?: string | null; className?: string }) {
  if (!children?.trim()) return null;
  return (
    <div
      className={`space-y-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mt-1.5 [&_strong]:text-foreground [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:font-bold [&_h3]:text-foreground [&_a]:text-primary [&_a]:underline ${className}`}
    >
      <Markdown>{children}</Markdown>
    </div>
  );
}
