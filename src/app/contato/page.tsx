import { fetchStrapi } from "@/lib/strapi";
import { PageHeader } from "@/components/PageHeader";

interface ContatoPageData {
  introducao?: string;
}

interface ConfiguracaoGlobal {
  footer_localidade?: string;
  footer_email?: string;
}

async function getContatoData() {
  const [contato, config] = await Promise.all([
    fetchStrapi<ContatoPageData>("/contato-page"),
    fetchStrapi<ConfiguracaoGlobal>("/configuracao-global"),
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
                <label className="text-sm font-semibold text-dark">Nome</label>
                <input
                  type="text"
                  className="w-full p-3 bg-white border border-neutral-border rounded focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-dark">E-mail</label>
                <input
                  type="email"
                  className="w-full p-3 bg-white border border-neutral-border rounded focus:ring-2 focus:ring-primary outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-dark">Assunto</label>
              <input
                type="text"
                className="w-full p-3 bg-white border border-neutral-border rounded focus:ring-2 focus:ring-primary outline-none"
                placeholder="Qual o tema da mensagem?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-dark">Mensagem</label>
              <textarea
                rows={5}
                className="w-full p-3 bg-white border border-neutral-border rounded focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="Escreva sua mensagem aqui..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-dark text-white font-bold py-4 rounded transition-colors"
            >
              Enviar mensagem
            </button>
          </form>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-dark">Informações de Contato</h3>
            <div className="space-y-4 text-sm text-neutral-text">
              {config?.footer_localidade && <p>{config.footer_localidade}</p>}
              {config?.footer_email && <p>{config.footer_email}</p>}
              {!config?.footer_localidade && !config?.footer_email && (
                <p>Cadastre a localidade e o e-mail em Configuração Global no Strapi.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
