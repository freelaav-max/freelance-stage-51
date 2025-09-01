
import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { getOfferById } from '@/lib/offers';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OfferChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if no offer ID
  if (!id) {
    return <Navigate to="/ofertas" replace />;
  }

  // Fetch specific offer by ID
  const { data: offer, isLoading, error } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => getOfferById(id),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Carregando oferta...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Oferta não encontrada</h2>
              <p className="text-muted-foreground">
                A oferta que você está procurando não existe ou foi removida.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if user is involved in this offer
  if (!user || (user.id !== offer.client_id && user.id !== offer.freelancer_id)) {
    return <Navigate to="/ofertas" replace />;
  }

  // Determine who is the other party in the conversation
  const isClient = user.id === offer.client_id;
  const otherParty = isClient ? offer.freelancer : offer.client;
  const receiverId = isClient ? offer.freelancer_id : offer.client_id;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    counter_proposed: 'bg-blue-100 text-blue-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    accepted: 'Aceita',
    rejected: 'Rejeitada',
    counter_proposed: 'Contraproposta',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mini header for chat page */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/ofertas')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Ofertas
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
        {/* Offer Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{offer.title}</CardTitle>
                <p className="text-muted-foreground mt-1">
                  {isClient ? `Para: ${otherParty?.full_name}` : `De: ${otherParty?.full_name}`}
                </p>
              </div>
              <Badge className={statusColors[offer.status as keyof typeof statusColors]}>
                {statusLabels[offer.status as keyof typeof statusLabels]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Data do Evento</span>
                <p>{format(new Date(offer.event_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
              {offer.event_time && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Horário</span>
                  <p>{offer.event_time}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Orçamento</span>
                <p>R$ {offer.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-sm font-medium text-muted-foreground">Local</span>
              <p>{offer.location}</p>
            </div>
            {offer.description && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Descrição</span>
                <p className="mt-1">{offer.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <ChatInterface
          offerId={offer.id}
          receiverId={receiverId}
          receiverName={otherParty?.full_name || 'Usuário'}
          receiverAvatar={undefined} // Avatar URL would come from profiles table
        />
        </div>
      </div>
    </div>
  );
};

export default OfferChat;
