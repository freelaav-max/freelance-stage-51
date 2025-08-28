
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Busque e Compare",
    description: "Use nossos filtros para encontrar o profissional ideal para seu projeto. Compare preços, avaliações e portfólios.",
    number: "01"
  },
  {
    icon: MessageCircle,
    title: "Negocie e Contrate",
    description: "Envie ofertas detalhadas e negocie diretamente com os freelancers. Tudo centralizado em nossa plataforma.",
    number: "02"
  },
  {
    icon: Calendar,
    title: "Confirme e Pague",
    description: "Reserve a data com segurança. Pagamento protegido e liberado apenas após a conclusão do serviço.",
    number: "03"
  },
  {
    icon: Star,
    title: "Avalie a Experiência",
    description: "Após o evento, avalie o profissional e ajude outros clientes a fazer a melhor escolha.",
    number: "04"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Como Funciona
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Contrate em 4 Passos Simples
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossa plataforma torna o processo de contratação simples,
            seguro e eficiente para ambos os lados.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-white border border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">Suporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium">Garantia de Qualidade</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
