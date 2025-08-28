import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, DollarSign, MessageCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOffers } from '@/lib/offers';
import { OfferActions } from '@/components/offers/OfferActions';
import Header from '@/components/Header';

const Offers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['offers', user?.id],
    queryFn: () => getOffers(user!.id),
    enabled: !!user,
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg text-muted-foreground">Carregando ofertas...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg text-destructive">Erro ao carregar ofertas</div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'counter_offer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      case 'counter_offer':
        return 'Contraproposta';
      default:
        return status;
    }
  };

  const isFreelancer = user.user_metadata?.user_type === 'freelancer';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minhas Ofertas</h1>
          <p className="text-muted-foreground">
            {isFreelancer 
              ? 'Gerencie as ofertas que você recebeu'
              : 'Acompanhe as ofertas que você enviou'
            }
          </p>
        </div>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma oferta encontrada</h3>
                <p>
                  {isFreelancer 
                    ? 'Você ainda não recebeu nenhuma oferta. Complete seu perfil para atrair mais clientes!'
                    : 'Você ainda não enviou nenhuma oferta. Encontre freelancers e envie sua primeira oferta!'
                  }
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate(isFreelancer ? '/profile' : '/search')}
                >
                  {isFreelancer ? 'Completar Perfil' : 'Buscar Freelancers'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(offer.event_date).toLocaleDateString('pt-BR')}</span>
                          {offer.event_time && (
                            <span>às {offer.event_time}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{offer.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>R$ {offer.budget}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(offer.status)}>
                      {getStatusText(offer.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <p className="text-muted-foreground">{offer.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isFreelancer && offer.client ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="text-xs">
                              {offer.client.full_name?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{offer.client.full_name}</p>
                            <p className="text-xs text-muted-foreground">Cliente</p>
                          </div>
                        </>
                      ) : offer.freelancer ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="text-xs">
                              {offer.freelancer.full_name?.charAt(0) || 'F'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{offer.freelancer.full_name}</p>
                            <p className="text-xs text-muted-foreground">Freelancer</p>
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/oferta/${offer.id}`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      
                      {isFreelancer && offer.status === 'pending' && (
                        <OfferActions offer={offer} userType="freelancer" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;