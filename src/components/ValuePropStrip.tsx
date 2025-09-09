import { Badge } from "@/components/ui/badge";
import { Shield, UserCheck, FileText, MessageCircle } from "lucide-react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

interface ValuePropStripProps {
  className?: string;
}

const ValuePropStrip = ({ className = "" }: ValuePropStripProps) => {
  const valueProps = [
    {
      icon: UserCheck,
      title: "Talentos Verificados",
      description: "Profissionais pré-selecionados"
    },
    {
      icon: Shield,
      title: "Pagamentos Protegidos",
      description: "Sistema seguro de pagamentos"
    },
    {
      icon: FileText,
      title: "Contratos Digitais",
      description: "Geração automática de contratos"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integrado",
      description: "Comunicação familiar e eficiente"
    }
  ];

  return (
    <section className={`py-12 bg-background/50 ${className}`}>
      <div className="container">
        <MotionWrapper preset="fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full surface-elevated flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{prop.title}</h3>
                  <p className="text-xs text-muted-foreground">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
};

export default ValuePropStrip;