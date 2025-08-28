import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getOffers } from '@/lib/offers';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { OfferActions } from '@/components/offers/OfferActions';
import Header from '@/components/Header';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useEffect } from 'react';

const OfferChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clearUnread } = useRealtimeNotifications();

  // Clear unread notifications when user visits offer chat
  useEffect(() => {
    clearUnread();
  }, [clearUnread]);

  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['offers', user?.id],
    queryFn: () => getOffers(user!.id),
    enabled: !!user,
  });

  const offer = offers.find(o => o.id === id);

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
            <div className="text-lg text-muted-foreground">Carregando oferta...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg text-destructive">Oferta não encontrada</div>
          </div>
        </div>
      </div>
    );
  }

  const isFreelancer = user.user_metadata?.user_type === 'freelancer';
  const isClient = user.user_metadata?.user_type === 'client';
  
  // Determine receiver based on user type
  const receiverId = isFreelancer ? offer.client_id : offer.freelancer_id;
  const receiverProfile = isFreelancer ? offer.client : offer.freelancer;
  const receiverName = receiverProfile?.full_name || 'Usuário';

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'counter_proposed':
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
      case 'counter_proposed':
        return 'Contraproposta';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/ofertas')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para ofertas
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Offer Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(offer.status)}>
                    {getStatusText(offer.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(offer.event_date).toLocaleDateString('pt-BR')}</span>
                    {offer.event_time && (
                      <span>às {offer.event_time}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{offer.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>R$ {offer.budget}</span>
                  </div>
                  
                  {offer.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{offer.duration} horas</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Descrição</h4>
                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="text-xs">
                        {receiverName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{receiverName}</p>
                      <p className="text-xs text-muted-foreground">
                        {isFreelancer ? 'Cliente' : 'Freelancer'}
                      </p>
                    </div>
                  </div>
                </div>

                {isFreelancer && offer.status === 'pending' && (
                  <div className="pt-4 border-t">
                    <OfferActions offer={offer} userType="freelancer" />
                  </div>
                )}
                
                {!isFreelancer && offer.status === 'counter_proposed' && (
                  <div className="pt-4 border-t">
                    <OfferActions offer={offer} userType="client" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Conversa</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ChatInterface
                  offerId={offer.id}
                  receiverId={receiverId}
                  receiverName={receiverName}
                  receiverAvatar=""
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferChat;