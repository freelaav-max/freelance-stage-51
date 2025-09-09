import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  FileText, 
  MessageCircle, 
  ThumbsUp, 
  Star,
  Users,
  Shield,
  Clock,
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  Mic,
  Video,
  Lightbulb,
  Monitor,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ForClientsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ProfessionalCategoriesSection />
      <ComparisonSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Para Clientes
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Encontre os melhores profissionais de áudio e vídeo
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Contrate técnicos de som, operadores de câmera, iluminadores e outros profissionais qualificados para eventos, produções e projetos de qualquer porte.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => navigate('/search')}
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar profissionais
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
            >
              Como funciona
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center text-purple-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Profissionais verificados em todo o Brasil</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: Search,
      title: "Busque profissionais qualificados",
      description: "Filtre por especialidade, localização, disponibilidade e faixa de preço para encontrar o profissional ideal.",
      number: "01"
    },
    {
      icon: FileText,
      title: "Envie uma oferta de trabalho",
      description: "Descreva seu projeto, datas, local e valor oferecido para os profissionais selecionados.",
      number: "02"
    },
    {
      icon: MessageCircle,
      title: "Negocie os detalhes",
      description: "Converse com o profissional via plataforma para alinhar expectativas e finalizar os termos.",
      number: "03"
    },
    {
      icon: ThumbsUp,
      title: "Confirme a contratação",
      description: "Após acordo, confirme a contratação pagando um sinal para garantir a data.",
      number: "04"
    },
    {
      icon: Star,
      title: "Avalie o serviço prestado",
      description: "Após o evento, avalie o profissional e ajude outros clientes a fazerem boas escolhas.",
      number: "05"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200">
            Como Funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Contrate profissionais em 5 passos simples
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossa plataforma torna o processo de contratação rápido, seguro e eficiente
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-center mb-16 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-px h-20 bg-border ml-8" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: Users,
      title: "Profissionais verificados",
      description: "Todos os freelancers passam por um processo de verificação para garantir qualidade e confiabilidade."
    },
    {
      icon: Shield,
      title: "Contratação segura",
      description: "Sistema de pagamento protegido com liberação do valor final apenas após a conclusão do serviço."
    },
    {
      icon: FileText,
      title: "Contratos automatizados",
      description: "Geração automática de contratos para proteger ambas as partes e garantir o cumprimento dos acordos."
    },
    {
      icon: Clock,
      title: "Economia de tempo",
      description: "Encontre profissionais disponíveis nas datas desejadas sem precisar fazer dezenas de ligações."
    },
    {
      icon: DollarSign,
      title: "Transparência de preços",
      description: "Veja valores de mercado e negocie diretamente com os profissionais sem intermediários."
    },
    {
      icon: MessageSquare,
      title: "Comunicação facilitada",
      description: "Chat na plataforma para comunicação eficiente antes e durante o evento."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-muted/50">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200">
            Benefícios
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher nossa plataforma
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vantagens exclusivas para tornar suas contratações mais eficientes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ProfessionalCategoriesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories = [
    {
      icon: Mic,
      title: "Técnicos de Som",
      description: "Sonoplastas, operadores de mesa, técnicos de PA e monitores."
    },
    {
      icon: Video,
      title: "Operadores de Câmera",
      description: "Cinegrafistas, operadores de câmera e diretores de fotografia."
    },
    {
      icon: Lightbulb,
      title: "Iluminadores",
      description: "Técnicos de iluminação, operadores de mesa de luz e projecionistas."
    },
    {
      icon: Monitor,
      title: "Técnicos de LED",
      description: "Especialistas em painéis de LED, telões e projeções."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200">
            Categorias
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Categorias de profissionais
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encontre o especialista ideal para o seu projeto
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver profissionais
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Ver todas as categorias
          </Button>
        </div>
      </div>
    </section>
  );
};

const ComparisonSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const comparisonItems = [
    {
      traditional: "Buscar indicações e fazer dezenas de ligações",
      platform: "Encontrar profissionais disponíveis em minutos com filtros avançados"
    },
    {
      traditional: "Negociar valores sem referência de mercado",
      platform: "Ver preços transparentes e perfis completos antes de contratar"
    },
    {
      traditional: "Pagar 100% adiantado ou correr risco de problemas",
      platform: "Sistema de pagamento seguro com sinal e proteção para ambas as partes"
    },
    {
      traditional: "Contratos informais ou inexistentes",
      platform: "Contratos profissionais gerados automaticamente"
    },
    {
      traditional: "Comunicação descentralizada e ineficiente",
      platform: "Comunicação centralizada na plataforma"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-muted/50">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200">
            Comparativo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Compare e comprove
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A forma mais inteligente de contratar profissionais de áudio e vídeo
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full bg-muted">
              <CardHeader>
                <CardTitle className="text-center text-muted-foreground">
                  Método Tradicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {comparisonItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5 mr-3" />
                      <p className="text-sm">{item.traditional}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="text-center">
                  Nossa Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {comparisonItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0 mt-0.5 mr-3" />
                      <p className="text-sm">{item.platform}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faqs = [
    {
      question: "Como faço para buscar um profissional?",
      answer: "Na página inicial, utilize os filtros de especialidade, localização, data e preço para encontrar os profissionais que melhor se encaixam no seu projeto."
    },
    {
      question: "É seguro contratar pela plataforma?",
      answer: "Sim, todos os profissionais passam por um processo de verificação. Além disso, nosso sistema de pagamento seguro garante que o valor só é liberado ao freelancer após a conclusão do serviço."
    },
    {
      question: "Posso negociar o preço diretamente com o freelancer?",
      answer: "Sim, a plataforma permite que você envie ofertas e negocie os termos diretamente com o profissional antes de fechar o contrato."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Você paga um sinal para confirmar a reserva e o restante do valor é liberado após a conclusão e sua aprovação do serviço. Aceitamos diversas formas de pagamento."
    },
    {
      question: "O que acontece se eu precisar cancelar um serviço?",
      answer: "Temos políticas de cancelamento claras. Em caso de cancelamento dentro do prazo estipulado, o sinal pode ser reembolsado de acordo com as regras estabelecidas."
    },
    {
      question: "Posso contratar o mesmo profissional para eventos futuros?",
      answer: "Sim, você pode favoritar profissionais e contatá-los diretamente para projetos futuros através da plataforma."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200">
            Perguntas Frequentes
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tire suas dúvidas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Respostas para as perguntas mais comuns sobre contratação
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Não encontrou o que procurava?
            </p>
            <Button variant="outline">
              Entre em contato
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const FinalCTASection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white">
      <div className="container px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Pronto para encontrar os melhores profissionais?
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Junte-se a milhares de clientes que já encontraram os profissionais ideais para seus projetos através da nossa plataforma.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-white/90"
            onClick={() => navigate('/search')}
          >
            <Search className="mr-2 h-5 w-5" />
            Buscar profissionais agora
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={() => navigate('/auth')}
          >
            Criar conta gratuita
          </Button>
        </motion.div>
        
        <motion.p 
          className="mt-6 text-sm text-purple-100"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Cadastro gratuito • Sem taxa de inscrição • Suporte especializado
        </motion.p>
      </div>
    </section>
  );
};

export default ForClientsPage;