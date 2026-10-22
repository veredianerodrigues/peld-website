import { Fragment, type ReactNode } from "react";

// Subconjunto do formato "blocks" do Strapi 5 usado pelo editor do painel.
type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};
type LinkNode = { type: "link"; url: string; children: TextNode[] };
type ListItemNode = { type: "list-item"; children: InlineNode[] };
type InlineNode = TextNode | LinkNode | ListItemNode;

export type Block =
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: "list"; format: "ordered" | "unordered"; children: (ListItemNode | Block)[] }
  | { type: "quote"; children: InlineNode[] }
  | { type: "code"; children: InlineNode[] }
  | { type: "image"; image: { url: string; alternativeText?: string | null } };

function renderText(node: TextNode, key: number): ReactNode {
  let out: ReactNode = node.text;
  if (node.code) out = <code>{out}</code>;
  if (node.bold) out = <strong>{out}</strong>;
  if (node.italic) out = <em>{out}</em>;
  if (node.underline) out = <u>{out}</u>;
  if (node.strikethrough) out = <s>{out}</s>;
  return <Fragment key={key}>{out}</Fragment>;
}

function renderInline(nodes: InlineNode[]): ReactNode {
  return nodes.map((node, i) => {
    if (node.type === "text") return renderText(node, i);
    if (node.type === "link") {
      const external = /^https?:\/\//.test(node.url);
      return (
        <a
          key={i}
          href={node.url}
          className="text-primary underline"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {node.children.map(renderText)}
        </a>
      );
    }
    return <li key={i}>{renderInline(node.children)}</li>;
  });
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "paragraph": {
      const empty = block.children.every((c) => c.type === "text" && !c.text);
      return empty ? null : <p key={key}>{renderInline(block.children)}</p>;
    }
    case "heading": {
      const Tag = `h${Math.min(Math.max(block.level, 2), 4)}` as "h2" | "h3" | "h4";
      return (
        <Tag key={key} className="font-bold text-foreground text-xl pt-4">
          {renderInline(block.children)}
        </Tag>
      );
    }
    case "list": {
      const Tag = block.format === "ordered" ? "ol" : "ul";
      return (
        <Tag key={key} className={`pl-6 space-y-1 ${block.format === "ordered" ? "list-decimal" : "list-disc"}`}>
          {block.children.map((child, i) =>
            child.type === "list-item" ? <li key={i}>{renderInline(child.children)}</li> : renderBlock(child, i)
          )}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote key={key} className="border-l-4 border-primary pl-4 italic">
          {renderInline(block.children)}
        </blockquote>
      );
    case "code":
      return (
        <pre key={key} className="overflow-x-auto rounded bg-muted p-4 text-sm">
          <code>{renderInline(block.children)}</code>
        </pre>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={block.image.url} alt={block.image.alternativeText ?? ""} className="rounded-lg w-full h-auto" />
      );
    default:
      return null;
  }
}

/** Renderiza um campo "blocks" do Strapi (parágrafos, títulos, listas, citações, links, negrito/itálico). */
export function BlocksContent({ content, className = "" }: { content?: Block[] | null; className?: string }) {
  if (!content?.length) return null;
  return <div className={`space-y-5 ${className}`}>{content.map(renderBlock)}</div>;
}
