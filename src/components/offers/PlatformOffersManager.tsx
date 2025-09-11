import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOffers, updateOfferStatus } from '@/lib/offers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface OfferWithDetails {
  id: string;
  title: string;
  description: string;
  specialty: string;
  event_date: string;
  event_time?: string;
  location: string;
  budget: number;
  status: string;
  created_at: string;
  client: {
    full_name: string;
    email: string;
  };
}

export const PlatformOffersManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<OfferWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOffers = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getOffers(user.id);
      // Filter to show only offers where current user is the freelancer
      const freelancerOffers = data.filter(offer => offer.freelancer_id === user.id);
      setOffers(freelancerOffers as OfferWithDetails[]);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as ofertas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOfferAction = async (offerId: string, action: 'accepted' | 'rejected') => {
    try {
      setUpdating(offerId);
      await updateOfferStatus(offerId, { status: action });
      
      toast({
        title: "Sucesso",
        description: `Oferta ${action === 'accepted' ? 'aceita' : 'recusada'} com sucesso`,
      });
      
      await fetchOffers(); // Refresh the list
    } catch (error) {
      console.error('Error updating offer:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a oferta",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user?.id]);

  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const respondedOffers = offers.filter(offer => ['accepted', 'rejected'].includes(offer.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">Pendente</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aceita</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Recusada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando ofertas...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ofertas da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pendentes ({pendingOffers.length})
              </TabsTrigger>
              <TabsTrigger value="responded">
                Respondidas ({respondedOffers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {pendingOffers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma oferta pendente no momento
                    </div>
                  ) : (
                    pendingOffers.map((offer) => (
                      <Card key={offer.id} className="border border-primary/20">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg">{offer.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <User className="h-4 w-4" />
                                  <span className="text-sm text-muted-foreground">
                                    {offer.client.full_name}
                                  </span>
                                </div>
                              </div>
                              {getStatusBadge(offer.status)}
                            </div>

                            <p className="text-sm text-muted-foreground">
                              {offer.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>
                                  {new Date(offer.event_date).toLocaleDateString('pt-BR')}
                                  {offer.event_time && ` às ${offer.event_time}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>R$ {offer.budget.toLocaleString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{offer.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{offer.specialty}</Badge>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOfferAction(offer.id, 'rejected')}
                                disabled={updating === offer.id}
                                className="flex items-center gap-1"
                              >
                                <XCircle className="h-4 w-4" />
                                Recusar
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleOfferAction(offer.id, 'accepted')}
                                disabled={updating === offer.id}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Aceitar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="responded">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {respondedOffers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma oferta respondida ainda
                    </div>
                  ) : (
                    respondedOffers.map((offer) => (
                      <Card key={offer.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{offer.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <User className="h-4 w-4" />
                                  <span className="text-sm text-muted-foreground">
                                    {offer.client.full_name}
                                  </span>
                                </div>
                              </div>
                              {getStatusBadge(offer.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>
                                  {new Date(offer.event_date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>R$ {offer.budget.toLocaleString('pt-BR')}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                Respondida em {new Date(offer.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};