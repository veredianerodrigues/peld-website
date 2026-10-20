import { fetchStrapi } from "@/lib/strapi";
import { getConfiguracaoGlobal } from "@/lib/partners";
import { PageHeader } from "@/components/PageHeader";

interface ContatoPageData {
  introducao?: string;
}

async function getContatoData() {
  const [contato, config] = await Promise.all([
    fetchStrapi<ContatoPageData>("/contato-page"),
    getConfiguracaoGlobal(),
  ]);
  return { contato, config };
}

export default async function ContatoPage() {
  const { contato, config } = await getContatoData();

  return (
    <div className="pb-20">
      <PageHeader
        title="Contato"
        description={contato?.introducao ?? "Fale com a equipe do PELD Iguaçu."}
      />

      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">Nome</label>
                <input
                  type="text"
                  className="w-full p-3 bg-card border border-border rounded focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">E-mail</label>
                <input
                  type="email"
                  className="w-full p-3 bg-card border border-border rounded focus:ring-2 focus:ring-primary outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Assunto</label>
              <input
                type="text"
                className="w-full p-3 bg-card border border-border rounded focus:ring-2 focus:ring-primary outline-none"
                placeholder="Qual o tema da mensagem?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Mensagem</label>
              <textarea
                rows={5}
                className="w-full p-3 bg-card border border-border rounded focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="Escreva sua mensagem aqui..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-foreground text-primary-foreground font-bold py-4 rounded transition-colors"
            >
              Enviar mensagem
            </button>
          </form>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Informações de Contato</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              {config?.footer_localidade && <p>{config.footer_localidade}</p>}
              {config?.footer_email && <p>{config.footer_email}</p>}
              {!config?.footer_localidade && !config?.footer_email && (
                <p>Use o formulário ao lado para falar com a equipe.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
