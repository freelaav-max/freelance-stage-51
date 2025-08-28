
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Heart, MessageCircle } from "lucide-react";

const freelancers = [
  {
    id: 1,
    name: "Carlos Silva",
    specialty: "Cinegrafista",
    location: "São Paulo, SP",
    rating: 4.9,
    reviews: 127,
    price: "R$ 800/dia",
    available: true,
    pro: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    skills: ["Casamentos", "Corporativo", "4K"],
    description: "Especialista em casamentos e eventos corporativos há 8 anos."
  },
  {
    id: 2,
    name: "Ana Costa",
    specialty: "Técnica de Som",
    location: "Rio de Janeiro, RJ",
    rating: 5.0,
    reviews: 89,
    price: "R$ 600/dia",
    available: true,
    pro: true,
    image: "https://images.unsplash.com/photo-1494790108755-2616b9d3bb09?w=150&h=150&fit=crop&crop=face",
    skills: ["Shows", "Teatro", "Streaming"],
    description: "Técnica de som experiente em shows e eventos ao vivo."
  },
  {
    id: 3,
    name: "João Santos",
    specialty: "Iluminador",
    location: "Belo Horizonte, MG",
    rating: 4.8,
    reviews: 156,
    price: "R$ 700/dia",
    available: false,
    pro: false,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    skills: ["Palco", "Arquitetural", "LED"],
    description: "Iluminador profissional especializado em grandes eventos."
  },
  {
    id: 4,
    name: "Maria Oliveira",
    specialty: "VJ / Motion Designer",
    location: "São Paulo, SP",
    rating: 4.7,
    reviews: 73,
    price: "R$ 900/dia",
    available: true,
    pro: true,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    skills: ["Motion Graphics", "VJing", "3D"],
    description: "Criativa visual especializada em motion graphics e VJing."
  },
  {
    id: 5,
    name: "Pedro Lima",
    specialty: "Operador de Câmera",
    location: "Brasília, DF",
    rating: 4.9,
    reviews: 94,
    price: "R$ 750/dia",
    available: true,
    pro: false,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    skills: ["Multicâmera", "Corporativo", "Esportes"],
    description: "Operador experiente em transmissões e eventos esportivos."
  },
  {
    id: 6,
    name: "Sofia Mendes",
    specialty: "Editora de Vídeo",
    location: "Salvador, BA",
    rating: 4.8,
    reviews: 112,
    price: "R$ 400/dia",
    available: true,
    pro: true,
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    skills: ["After Effects", "Premiere", "Color"],
    description: "Editora especializada em pós-produção e correção de cor."
  }
];

const FreelancerGrid = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Profissionais em Destaque
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça alguns dos nossos melhores freelancers, avaliados pelos clientes
            e prontos para tornar seu evento inesquecível.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="freelancer-card group">
              <div className="relative mb-4">
                <img
                  src={freelancer.image}
                  alt={freelancer.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
                {freelancer.pro && (
                  <Badge className="badge-pro absolute -top-2 -right-2">
                    PRO
                  </Badge>
                )}
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white ${
                  freelancer.available ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg mb-1">{freelancer.name}</h3>
                <p className="text-muted-foreground mb-2">{freelancer.specialty}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{freelancer.location}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(freelancer.rating) ? 'fill-current' : ''
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{freelancer.rating}</span>
                  <span className="text-sm text-muted-foreground">({freelancer.reviews})</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 text-center">
                {freelancer.description}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {freelancer.skills.map((skill) => (
                  <Badge key={skill} className="badge-specialty text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="text-center mb-4">
                <span className="text-lg font-bold text-primary">{freelancer.price}</span>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 btn-gradient">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar Oferta
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className={`${
                  freelancer.available ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {freelancer.available ? 'Disponível' : 'Ocupado'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg">
            Ver Todos os Profissionais
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FreelancerGrid;
