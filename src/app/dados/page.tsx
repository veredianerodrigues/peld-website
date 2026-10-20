import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Dados" };

export default function DadosPage() {
  return (
    <div className="pb-20">
      <PageHeader
        title="Dados"
        description="Em breve, os dados de longa duração produzidos pelo PELD Iguaçu estarão disponíveis aqui."
      />
    </div>
  );
}
