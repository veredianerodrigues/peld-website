import { siFacebook, siInstagram, siTiktok, siWhatsapp, siX, siYoutube, type SimpleIcon } from "simple-icons";

/**
 * Ícone Material Symbols (Outlined). A fonte é carregada no layout com subset por
 * `icon_names`: ao usar um ícone novo, inclua o nome em MATERIAL_ICON_NAMES.
 */
export const MATERIAL_ICON_NAMES = ["link", "location_on", "mail"] as const;

export function MaterialIcon({
  name,
  className = "",
}: {
  name: (typeof MATERIAL_ICON_NAMES)[number];
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined leading-none select-none ${className}`}>
      {name}
    </span>
  );
}

export type RedeSocial = "instagram" | "facebook" | "youtube" | "x" | "tiktok" | "whatsapp" | "linkedin" | "site";

// Material Symbols não tem logos de marcas; usamos Simple Icons (CC0). LinkedIn não está no
// Simple Icons (removido a pedido da marca) e cai no ícone genérico de link, assim como "site".
const MARCAS: Partial<Record<RedeSocial, SimpleIcon>> = {
  instagram: siInstagram,
  facebook: siFacebook,
  youtube: siYoutube,
  x: siX,
  tiktok: siTiktok,
  whatsapp: siWhatsapp,
};

export const NOME_REDE: Record<RedeSocial, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  site: "Site",
};

export function SocialIcon({ rede, className = "size-5" }: { rede: RedeSocial; className?: string }) {
  const icon = MARCAS[rede];
  if (!icon) return <MaterialIcon name="link" className="text-[1.25rem]" />;
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}
