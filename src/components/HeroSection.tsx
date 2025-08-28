
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left fade-in">
            <Badge className="mb-4 bg-white/20 text-primary border-0">
              🚀 A Maior Plataforma de Freelancers Audiovisuais
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Conecte-se com os{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Melhores Profissionais
              </span>{" "}
              de Áudio e Vídeo
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Para freelancers: encontre trabalhos incríveis e gerencie sua carreira.
              Para clientes: contrate profissionais qualificados com segurança e agilidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="btn-gradient text-lg px-8" onClick={() => navigate('/auth')}>
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/para-freelancers')}>
                Para Freelancers
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
              <Button variant="link" className="text-primary underline" onClick={() => navigate('/como-funciona')}>
                Como Funciona
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="stat-number">2.5k+</div>
                <p className="text-sm text-muted-foreground">Freelancers</p>
              </div>
              <div className="text-center">
                <div className="stat-number">1.2k+</div>
                <p className="text-sm text-muted-foreground">Projetos</p>
              </div>
              <div className="text-center">
                <div className="stat-number">4.9</div>
                <p className="text-sm text-muted-foreground">Avaliação</p>
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
