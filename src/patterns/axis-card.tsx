import { type LucideIcon } from "lucide-react";

/**
 * Signature PELD Iguaçu card: soft rectangle with one sharp "flag" corner
 * (bottom-right, 40px radius) and a floating icon badge. Used for the four
 * research axes on the homepage — reuse for any 4-up feature grid.
 */
export function AxisCard({
  icon: Icon,
  title,
  description,
  color = "#1A9E96",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div className="card-axis group relative bg-white p-8 pt-12 shadow-sm hover:shadow-xl transition-all duration-300">
      <div
        className="absolute -top-6 left-8 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
        style={{ backgroundColor: color }}
      >
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-foreground mb-3 mt-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
