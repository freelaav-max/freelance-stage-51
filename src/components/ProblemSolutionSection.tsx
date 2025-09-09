import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingDown, 
  Eye, 
  FileX, 
  AlertTriangle, 
  Users2,
  MessageSquare,
  TrendingUp,
  Search,
  Shield,
  Calendar,
  Star,
  Smartphone
} from "lucide-react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const ProblemSolutionSection = () => {
  const problemSolutions = [
    {
      problemIcon: TrendingDown,
      problem: "Instabilidade e Sazonalidade",
      problemDesc: "Fluxo de trabalho imprevisível com períodos de alta e baixa demanda",
      solutionIcon: TrendingUp,
      solution: "Acesso Contínuo a Projetos",
      solutionDesc: "Vitrine ativa de oportunidades conectando você a clientes que buscam seus serviços"
    },
    {
      problemIcon: Eye,
      problem: "Falta de Visibilidade",
      problemDesc: "Dependência de indicações e redes de contato limitadas",
      solutionIcon: Search,
      solution: "Visibilidade Ampliada",
      solutionDesc: "Perfil profissional otimizado para exibir especialidades e experiência"
    },
    {
      problemIcon: FileX,
      problem: "Burocracia na Gestão",
      problemDesc: "Dificuldade em gerenciar agenda, propostas e contratos de forma organizada",
      solutionIcon: Calendar,
      solution: "Gestão Simplificada",
      solutionDesc: "Ferramentas intuitivas para gerenciar ofertas e agendamentos em um único lugar"
    },
    {
      problemIcon: AlertTriangle,
      problem: "Insegurança no Recebimento",
      problemDesc: "Risco de calotes ou atrasos no pagamento por parte dos clientes",
      solutionIcon: Shield,
      solution: "Segurança Financeira",
      solutionDesc: "Sistema de pagamento seguro que garante o recebimento pelos serviços prestados"
    },
    {
      problemIcon: Users2,
      problem: "Competição Desleal",
      problemDesc: "Dificuldade em se destacar sem um portfólio e reputação consolidados",
      solutionIcon: Star,
      solution: "Construção de Reputação",
      solutionDesc: "Sistema transparente de avaliações para construir uma reputação sólida"
    },
    {
      problemIcon: MessageSquare,
      problem: "Comunicação Fragmentada",
      problemDesc: "Troca de informações por múltiplos canais gerando desorganização",
      solutionIcon: Smartphone,
      solution: "Comunicação Centralizada",
      solutionDesc: "Chat integrado na plataforma e integração direta com WhatsApp"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <MotionWrapper preset="fadeIn" className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Problemas vs Soluções
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transformamos seus desafios em oportunidades
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja como nossa plataforma resolve os principais problemas dos freelancers de áudio e vídeo
          </p>
        </MotionWrapper>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problemSolutions.map((item, index) => {
            const ProblemIcon = item.problemIcon;
            const SolutionIcon = item.solutionIcon;
            
            return (
              <MotionWrapper key={index} preset="scaleIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Problem */}
                  <Card className="bg-destructive/5 border-destructive/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
                          <ProblemIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-destructive mb-1">{item.problem}</h3>
                          <p className="text-sm text-muted-foreground">{item.problemDesc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Solution */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <SolutionIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary mb-1">{item.solution}</h3>
                          <p className="text-sm text-muted-foreground">{item.solutionDesc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;