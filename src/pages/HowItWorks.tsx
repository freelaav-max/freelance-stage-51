import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageCircle, Calendar, Star, Shield, Clock, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: Search,
    title: "1. Busque e Compare",
    description: "Use nossos filtros avançados para encontrar o profissional ideal para seu projeto. Compare preços, avaliações e portfólios de forma fácil e rápida.",
    details: [
      "Filtre por especialidade (som, vídeo, iluminação)",
      "Busque por localização e disponibilidade",
      "Compare orçamentos e avaliações",
      "Visualize portfólios completos"
    ]
  },
  {
    icon: MessageCircle,
    title: "2. Negocie e Contrate",
    description: "Envie ofertas detalhadas e negocie diretamente com os freelancers. Todo o processo é centralizado em nossa plataforma segura.",
    details: [
      "Envie propostas detalhadas do projeto",
      "Negocie valores e condições",
      "Chat integrado para comunicação",
      "Histórico completo de conversas"
    ]
  },
  {
    icon: Calendar,
    title: "3. Confirme e Pague",
    description: "Reserve a data com segurança através do nosso sistema de pagamento protegido. O valor fica retido até a conclusão do serviço.",
    details: [
      "Pagamento de sinal para garantir a reserva",
      "Contrato digital automaticamente gerado",
      "Proteção total para ambas as partes",
      "Liberação após conclusão do serviço"
    ]
  },
  {
    icon: Star,
    title: "4. Avalie a Experiência",
    description: "Após o evento, avalie o profissional e compartilhe sua experiência. Isso ajuda outros clientes na escolha.",
    details: [
      "Sistema de avaliação mútua",
      "Comentários públicos no perfil",
      "Histórico de trabalhos realizados",
      "Construção de reputação contínua"
    ]
  }
];

const benefits = [
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Pagamentos protegidos, contratos digitais e verificação de profissionais."
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Encontre e contrate profissionais em minutos, não em dias."
  },
  {
    icon: DollarSign,
    title: "Preços Competitivos",
    description: "Compare orçamentos e encontre o melhor custo-benefício."
  },
  {
    icon: Users,
    title: "Rede Qualificada",
    description: "Acesso a uma rede curada de profissionais experientes."
  }
];

const HowItWorksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                Como Funciona
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contrate Freelancers de <span className="text-gradient">Áudio e Vídeo</span> em 4 Passos Simples
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Nossa plataforma conecta você aos melhores profissionais de áudio e vídeo do Brasil.
                Simples, seguro e eficiente para todos os tipos de projeto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="btn-gradient"
                  onClick={() => navigate('/search')}
                >
                  Começar Agora
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  Criar Conta Grátis
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid gap-16">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">{step.title}</h2>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex-1 lg:max-w-lg">
                      <Card className="border-0 shadow-elegant">
                        <CardContent className="p-8">
                          <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-xl flex items-center justify-center">
                            <Icon className="w-16 h-16 text-muted-foreground/30" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Por Que Escolher Nossa Plataforma?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Oferecemos as melhores condições e proteções para uma experiência de contratação perfeita.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center border-0 shadow-sm">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tire suas dúvidas sobre como funciona nossa plataforma.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto grid gap-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-3">Como funciona o pagamento?</h3>
                  <p className="text-muted-foreground">
                    O cliente paga um sinal de 30% para confirmar a reserva. O valor total fica retido na plataforma 
                    e é liberado para o freelancer após a confirmação da conclusão do serviço.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-3">E se o freelancer cancelar?</h3>
                  <p className="text-muted-foreground">
                    Caso o freelancer cancele, o valor pago é integralmente devolvido ao cliente. 
                    Além disso, ajudamos a encontrar um substituto rapidamente.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-3">Como são selecionados os profissionais?</h3>
                  <p className="text-muted-foreground">
                    Todos os freelancers passam por um processo de verificação de portfólio e experiência. 
                    Além disso, o sistema de avaliações garante a qualidade contínua.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-3">Posso negociar o preço?</h3>
                  <p className="text-muted-foreground">
                    Sim! Nossa plataforma facilita a negociação entre cliente e freelancer através 
                    do sistema de ofertas e contrapropostas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="container">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Pronto para Começar?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Junte-se a milhares de clientes que já encontraram os profissionais ideais para seus projetos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/search')}
                >
                  Buscar Freelancers
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate('/auth')}
                >
                  Criar Conta
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;