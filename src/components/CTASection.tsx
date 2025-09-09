import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Conecte-se com os melhores profissionais audiovisuais ou encontre seu próximo projeto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
              onClick={() => navigate('/search')}
            >
              Buscar Profissionais
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/auth')}
            >
              Criar Perfil
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;