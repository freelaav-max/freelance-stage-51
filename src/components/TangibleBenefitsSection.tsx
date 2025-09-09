import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Eye, CheckCircle, DollarSign } from "lucide-react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const TangibleBenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Aumento da Renda",
      metric: "+40%",
      description: "Mais oportunidades de trabalho e menor tempo ocioso",
      details: "freelancers ocupação média"
    },
    {
      icon: Clock,
      title: "Redução de Riscos",
      metric: "7 dias",
      description: "Tempo médio mais rápido para receber pagamentos",
      details: "vs métodos tradicionais"
    },
    {
      icon: Eye,
      title: "Otimização do Tempo",
      metric: "80%",
      description: "Menos tempo na busca por clientes, mais tempo criando",
      details: "redução tempo administrativo"
    },
    {
      icon: CheckCircle,
      title: "Crescimento Profissional",
      metric: "4.8/5",
      description: "Avaliação média dos freelancers na plataforma",
      details: "índice de satisfação"
    },
    {
      icon: DollarSign,
      title: "Flexibilidade Total",
      metric: "100%",
      description: "Controle completo sobre agenda, preços e projetos",
      details: "autonomia profissional"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <MotionWrapper preset="fadeIn" className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Benefícios Tangíveis
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Resultados que você pode medir
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja o impacto real que nossa plataforma tem na carreira dos freelancers
          </p>
        </MotionWrapper>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            
            return (
              <MotionWrapper key={index} preset="scaleIn">
                <Card className="h-full hover:shadow-lg transition-shadow group text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {benefit.metric}
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{benefit.description}</p>
                    <p className="text-xs text-muted-foreground/70 font-medium">
                      {benefit.details}
                    </p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            );
          })}
        </div>
        
        <MotionWrapper preset="fadeIn" className="mt-12 text-center">
          <div className="glass-card p-6 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4">
              * Dados baseados em pesquisa com freelancers ativos na plataforma durante os últimos 12 meses
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Mais de 2.500 freelancers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>1.200+ projetos concluídos</span>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
};

export default TangibleBenefitsSection;