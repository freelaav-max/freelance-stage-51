import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  UserPlus,
  Calendar,
  MessageCircle,
  CreditCard,
  Search,
  DollarSign,
  Star,
  Shield,
  CheckCircle,
  
  Check,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForFreelancersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection navigate={navigate} />
        <HowItWorksSection />
        <BenefitsSection />
        <PricingSection navigate={navigate} />
        <FAQSection />
        <FinalCTASection navigate={navigate} />
      </main>
      <Footer />
    </div>
  );
};

const HeroSection: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative bg-gradient-primary text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              Para Freelancers
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Expanda sua carreira como freelancer de áudio e vídeo
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Conecte-se com clientes qualificados, gerencie seus projetos e receba pagamentos de forma segura em uma única plataforma especializada para profissionais de áudio e vídeo.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/auth')}
            >
              Criar conta grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Como funciona
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center text-white/90"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            <p>Cadastro gratuito, pague apenas quando receber trabalhos</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: UserPlus,
      title: "Crie seu perfil profissional",
      description: "Destaque suas habilidades, experiência e portfólio para atrair clientes qualificados.",
      number: "01"
    },
    {
      icon: Calendar,
      title: "Defina sua disponibilidade",
      description: "Marque no calendário os dias e horários em que está disponível para trabalhar.",
      number: "02"
    },
    {
      icon: MessageCircle,
      title: "Receba ofertas de trabalho",
      description: "Clientes enviarão propostas com detalhes do projeto e valores oferecidos.",
      number: "03"
    },
    {
      icon: CreditCard,
      title: "Receba pagamentos seguros",
      description: "O cliente paga um sinal e o restante é liberado após a conclusão do trabalho.",
      number: "04"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Como Funciona
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siga estes passos simples para começar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossa plataforma torna o processo de contratação simples,
            seguro e eficiente para ambos os lados.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: Search,
      title: "Visibilidade para clientes qualificados",
      description: "Seja encontrado por clientes que buscam especificamente suas habilidades e experiência."
    },
    {
      icon: DollarSign,
      title: "Pagamentos seguros",
      description: "Sistema de pagamento com sinal antecipado e liberação garantida após a conclusão do trabalho."
    },
    {
      icon: Calendar,
      title: "Gestão de disponibilidade",
      description: "Calendário integrado para gerenciar seus compromissos e evitar conflitos de agenda."
    },
    {
      icon: Star,
      title: "Construa sua reputação",
      description: "Receba avaliações de clientes para destacar a qualidade do seu trabalho."
    },
    {
      icon: MessageCircle,
      title: "Comunicação integrada",
      description: "Chat na plataforma e integração com WhatsApp para comunicação eficiente."
    },
    {
      icon: Shield,
      title: "Contratos automatizados",
      description: "Geração automática de contratos para proteger ambas as partes."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Benefícios
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher nossa plataforma
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra como nossa plataforma pode transformar sua carreira como freelancer
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="bg-background p-6 rounded-lg border hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


const PricingSection: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: "Básico",
      price: "Grátis",
      description: "Ideal para freelancers iniciantes",
      features: [
        "Perfil completo na plataforma",
        "Até 5 habilidades destacadas",
        "Receba até 10 ofertas por mês",
        "Comissão de 15% sobre trabalhos",
        "Suporte por email"
      ],
      cta: "Começar grátis",
      popular: false
    },
    {
      name: "PRO",
      price: "R$ 49,90/mês",
      description: "Para freelancers estabelecidos",
      features: [
        "Tudo do plano Básico",
        "Destaque nos resultados de busca",
        "Até 15 habilidades destacadas",
        "Ofertas ilimitadas",
        "Comissão reduzida de 10%",
        "Contratos personalizados",
        "Suporte prioritário"
      ],
      cta: "Assinar plano PRO",
      popular: true
    },
    {
      name: "Premium",
      price: "R$ 99,90/mês",
      description: "Para profissionais de alto nível",
      features: [
        "Tudo do plano PRO",
        "Selo de verificação Premium",
        "Habilidades ilimitadas",
        "Comissão reduzida de 5%",
        "Destaque máximo nas buscas",
        "Estatísticas avançadas",
        "Suporte VIP 24/7"
      ],
      cta: "Assinar plano Premium",
      popular: false
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Planos e Preços
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha o plano ideal para sua carreira
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comece gratuitamente e evolua conforme seu negócio cresce
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`bg-background rounded-lg border overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary relative' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-xs font-semibold py-2 text-center">
                  MAIS POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => navigate('/auth')}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.p
          className="text-center mt-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Todos os planos incluem acesso ao sistema de pagamentos seguros e integração com WhatsApp.
        </motion.p>
      </div>
    </section>
  );
};

const FAQSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faqs = [
    {
      question: "Como funciona o sistema de comissões?",
      answer: "Cobramos uma pequena comissão apenas quando você recebe um pagamento por um trabalho realizado através da plataforma. A comissão varia de 5% a 15%, dependendo do seu plano de assinatura."
    },
    {
      question: "Quando recebo o pagamento pelos trabalhos?",
      answer: "O cliente paga um sinal de 30% ao confirmar o booking, que é liberado para você imediatamente. Os 70% restantes são pagos pelo cliente ao final do trabalho e liberados para você após a confirmação de entrega."
    },
    {
      question: "Posso usar a plataforma apenas pelo celular?",
      answer: "Sim! Nossa plataforma é totalmente responsiva e pode ser acessada pelo navegador do celular. Além disso, você pode receber notificações e se comunicar com clientes diretamente pelo WhatsApp."
    },
    {
      question: "Como são gerados os contratos de trabalho?",
      answer: "Os contratos são gerados automaticamente com base nas informações do booking, incluindo escopo do trabalho, datas, valores e condições. Você pode revisar o contrato antes de aceitar o trabalho."
    },
    {
      question: "Posso cancelar um trabalho após aceitar?",
      answer: "Sim, mas recomendamos evitar cancelamentos para manter uma boa reputação. Em caso de necessidade, você deve cancelar com a maior antecedência possível e pode estar sujeito a penalidades conforme os termos de uso."
    },
    {
      question: "Como funciona o plano de assinatura PRO?",
      answer: "O plano PRO é cobrado mensalmente e pode ser cancelado a qualquer momento. Ele oferece benefícios como destaque nos resultados de busca, comissão reduzida e suporte prioritário."
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tire suas dúvidas sobre como trabalhar na plataforma
          </p>
        </motion.div>
        
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Não encontrou o que procurava?
            </p>
            <Button variant="outline">
              Entre em contato
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FinalCTASection: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="bg-gradient-primary text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Pronto para impulsionar sua carreira como freelancer?
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-8 text-white/90 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Junte-se a milhares de profissionais de áudio e vídeo que estão expandindo seus negócios e encontrando novos clientes todos os dias.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate('/auth')}
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="mt-4 text-sm text-white/80">
            Não é necessário cartão de crédito. Cadastro 100% gratuito.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ForFreelancersPage;