
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Users, Calendar, Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left fade-in">
            <Badge className="mb-4 bg-white/20 text-primary border-0">
              🎬 Marketplace de Freelancers de Áudio e Vídeo
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Marketplace de{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Freelancers de Áudio e Vídeo
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Conecte clientes e profissionais com pagamentos protegidos, contratos digitais e comunicação integrada.
            </p>
            
            {/* Value Proposition for Each Persona */}
            <div className="space-y-4 mb-8">
              <MotionWrapper preset="fadeIn" className="glass-card p-4 rounded-lg">
                <p className="text-lg font-medium">
                  <span className="text-primary">Para clientes:</span> encontre e contrate com segurança em minutos.
                </p>
              </MotionWrapper>
              <MotionWrapper preset="fadeIn" className="glass-card p-4 rounded-lg">
                <p className="text-lg font-medium">
                  <span className="text-primary">Para freelancers:</span> tenha visibilidade, negocie e receba com proteção.
                </p>
              </MotionWrapper>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" variant="premium" className="text-lg px-8" onClick={() => navigate('/search')}>
                <Search className="w-5 h-5 mr-2" />
                Buscar Profissionais
              </Button>
              <Button size="lg" variant="hero" className="text-lg px-8" onClick={() => navigate('/auth')}>
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Perfil Grátis
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-12">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-primary/10 text-primary">✓</Badge>
                <span>Talentos verificados</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-primary/10 text-primary">✓</Badge>
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-primary/10 text-primary">✓</Badge>
                <span>Contratos digitais</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-primary/10 text-primary">✓</Badge>
                <span>WhatsApp integrado</span>
              </div>
            </div>
          </div>
          
          <div className="relative slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="freelancer-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary"></div>
                    <div>
                      <h3 className="font-semibold">Carlos Silva</h3>
                      <p className="text-sm text-muted-foreground">Cinegrafista</p>
                    </div>
                  </div>
                  <div className="rating-stars mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge className="badge-specialty">São Paulo</Badge>
                </div>
                
                <div className="freelancer-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-secondary"></div>
                    <div>
                      <h3 className="font-semibold">Ana Costa</h3>
                      <p className="text-sm text-muted-foreground">Técnica de Som</p>
                    </div>
                  </div>
                  <div className="rating-stars mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge className="badge-pro">PRO</Badge>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="freelancer-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary"></div>
                    <div>
                      <h3 className="font-semibold">João Santos</h3>
                      <p className="text-sm text-muted-foreground">Iluminador</p>
                    </div>
                  </div>
                  <div className="rating-stars mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge className="badge-specialty">Rio de Janeiro</Badge>
                </div>
                
                <div className="freelancer-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-secondary"></div>
                    <div>
                      <h3 className="font-semibold">Maria Oliveira</h3>
                      <p className="text-sm text-muted-foreground">VJ / Motion</p>
                    </div>
                  </div>
                  <div className="rating-stars mb-2">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <Star className="w-4 h-4" />
                  </div>
                  <Badge className="badge-specialty">Belo Horizonte</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
