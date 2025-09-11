import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewDisplay } from '@/components/reviews/ReviewDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';
import { PaymentDisclaimer } from '@/components/PaymentDisclaimer';
import {
  Calendar,
  MapPin,
  DollarSign,
  User,
  MessageSquare,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

interface BookingDetails {
  id: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'in_progress';
  total_amount: number;
  deposit_amount: number;
  location: string;
  event_date: string;
  completed_at?: string;
  created_at: string;
  offer: {
    title: string;
    description: string;
    specialty: string;
    event_time?: string;
  };
  freelancer: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  client: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

const BookingDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  
  useEffect(() => {
    if (!id || !user) return;
    fetchBookingDetails();
  }, [id, user]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          total_amount,
          deposit_amount,
          location,
          event_date,
          completed_at,
          created_at,
          offer:offers(
            title,
            description,
            specialty,
            event_time
          ),
          freelancer:profiles!bookings_freelancer_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          client:profiles!bookings_client_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Check if user has permission to view this booking
      if (data.freelancer.id !== user.id && data.client.id !== user.id) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para ver este booking",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setBooking(data);
      
      // Check for existing review
      if (data.status === 'completed') {
        const { data: review } = await supabase
          .from('reviews')
          .select('*')
          .eq('booking_id', id)
          .eq('giver_id', user.id)
          .single();
          
        setExistingReview(review);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        title: "Erro ao carregar booking",
        description: "Não foi possível carregar os detalhes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!booking || booking.status !== 'confirmed') return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking marcado como concluído",
        description: "Agora você pode avaliar o serviço prestado",
      });

      fetchBookingDetails();
    } catch (error) {
      console.error('Error completing booking:', error);
      toast({
        title: "Erro ao completar booking",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Booking não encontrado</p>
              <Button onClick={() => navigate('/dashboard')} className="mt-4">
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const isClient = user?.id === booking.client.id;
  const isFreelancer = user?.id === booking.freelancer.id;
  const canComplete = booking.status === 'confirmed' && isClient;
  const canReview = booking.status === 'completed' && !existingReview;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              ← Voltar
            </Button>
            <h1 className="text-2xl font-bold">Detalhes do Booking</h1>
          </div>

          <div className="grid gap-6">
            {/* Main Booking Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {booking.offer.title}
                      <Badge variant="secondary">{booking.offer.specialty}</Badge>
                    </CardTitle>
                  </div>
                  <StatusBadge status={booking.status === 'confirmed' ? 'pending' : booking.status === 'completed' ? 'completed' : 'rejected'} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <PaymentDisclaimer />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Data do Evento</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.event_date).toLocaleDateString('pt-BR')}
                          {booking.offer.event_time && ` às ${booking.offer.event_time}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Local</p>
                        <p className="text-sm text-muted-foreground">{booking.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Valor Total</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {booking.total_amount.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {isClient ? 'Freelancer' : 'Cliente'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isClient ? booking.freelancer.full_name : booking.client.full_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Criado em</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {booking.completed_at && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Concluído em</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.completed_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Descrição do Serviço</h3>
                  <p className="text-sm text-muted-foreground">{booking.offer.description}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/messages`)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Button>

                  {canComplete && (
                    <Button
                      onClick={handleCompleteBooking}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marcar como Concluído
                    </Button>
                  )}

                  {canReview && (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Avaliar Serviço
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Review Section */}
            {booking.status === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                  {existingReview ? (
                    <ReviewDisplay reviews={[existingReview]} />
                  ) : showReviewForm ? (
                    <ReviewForm
                      bookingId={booking.id}
                      receiverId={isClient ? booking.freelancer.id : booking.client.id}
                      receiverName={isClient ? booking.freelancer.full_name : booking.client.full_name}
                      onSuccess={() => {
                        setShowReviewForm(false);
                        fetchBookingDetails();
                      }}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  ) : canReview ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Que tal avaliar o serviço prestado?
                      </p>
                      <Button onClick={() => setShowReviewForm(true)}>
                        Deixar Avaliação
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma avaliação ainda
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetails;