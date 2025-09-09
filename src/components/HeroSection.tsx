
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
              <Button size="lg" variant="premium" className="text-lg px-8" onClick={() => navigate('/search')}>
                Buscar Profissionais
              </Button>
              <Button size="lg" variant="hero" className="text-lg px-8" onClick={() => navigate('/auth')}>
                Cadastre-se Agora
              </Button>
            </div>
          </div>
          
          <div className="relative slide-up">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md h-64 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Conecte-se com profissionais qualificados</p>
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
