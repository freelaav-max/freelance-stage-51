import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  MessageCircle, 
  Shield, 
  FileText, 
  Smartphone 
} from "lucide-react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

interface DifferentialsProps {
  className?: string;
  variant?: 'cards' | 'list';
}

const Differentials = ({ className = "", variant = 'cards' }: DifferentialsProps) => {
  const differentials = [
    {
      icon: Mic,
      title: "Foco em Áudio e Vídeo",
      description: "Especialização que garante profissionais altamente relevantes e qualificados"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integrado",
      description: "Comunicação fluida e familiar para freelancers e clientes"
    },
    {
      icon: Shield,
      title: "Pagamentos Protegidos",
      description: "Sistema seguro que protege ambas as partes e minimiza riscos financeiros"
    },
    {
      icon: FileText,
      title: "Contratos Digitais",
      description: "Geração automática de contratos profissionais e transparentes"
    },
    {
      icon: Smartphone,
      title: "Interface Intuitiva",
      description: "Design mobile-first focado na usabilidade e experiência sem atritos"
    }
  ];

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {differentials.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <MotionWrapper key={index} preset="fadeIn" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full surface-elevated flex items-center justify-center text-primary flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{diff.title}</h3>
                <p className="text-sm text-muted-foreground">{diff.description}</p>
              </div>
            </MotionWrapper>
          );
        })}
      </div>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container">
        <MotionWrapper preset="fadeIn" className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Nossos Diferenciais
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que somos únicos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça os diferenciais que nos tornam a melhor opção para o mercado audiovisual
          </p>
        </MotionWrapper>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentials.map((diff, index) => {
            const Icon = diff.icon;
            return (
              <MotionWrapper key={index} preset="scaleIn">
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{diff.title}</h3>
                    <p className="text-muted-foreground text-sm">{diff.description}</p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Differentials;