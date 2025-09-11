import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useClientStats } from '@/hooks/useClientStats';
import { useClientBookings } from '@/hooks/useClientBookings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReferralSection from '@/components/referrals/ReferralSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  CreditCard,
  Users,
  Search,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  const { loading } = useAuthRequired();
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useClientStats();
  const { activeBookings, pastBookings, loading: bookingsLoading } = useClientBookings();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading || statsLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  // Placeholder for favorites - will be implemented when user_favorites table is created
  const favoriteFreelancers: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard do Cliente</h1>
              <p className="text-muted-foreground">Gerencie seus bookings e encontre freelancers</p>
            </div>
            <Button onClick={() => navigate('/search')} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar Freelancers
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bookings Ativos</p>
                    <p className="text-2xl font-bold">{stats.activeBookings}</p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trabalhos Concluídos</p>
                    <p className="text-2xl font-bold">{stats.completedBookings}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Freelancers Favoritos</p>
                    <p className="text-2xl font-bold">{stats.favoriteFreelancers}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor Total Acordado</p>
                    <p className="text-2xl font-bold">R$ {stats.totalSpent.toLocaleString('pt-BR')}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Bookings Ativos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Nenhum booking ativo no momento
                  </CardContent>
                </Card>
              ) : (
                activeBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.freelancer.full_name}</h3>
                            <Badge variant="secondary">{booking.offer.specialty}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {new Date(booking.event_date).toLocaleDateString('pt-BR')}
                              {booking.offer.event_time && ` às ${booking.offer.event_time}`}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </div>
                          </div>
                          <div className="text-lg font-semibold">
                            R$ {booking.total_amount.toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'}>
                            {booking.status === 'confirmed' ? 'Confirmado' : 'Pagamento Pendente'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Nenhum trabalho concluído ainda
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.freelancer.full_name}</h3>
                            <Badge variant="secondary">{booking.offer.specialty}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              {new Date(booking.event_date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {booking.status === 'completed' ? 'Concluído' : 'Cancelado'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>Sistema de favoritos será implementado em breve</p>
                  <p className="text-sm mt-2">Em desenvolvimento...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Referral Section */}
          <div className="mt-8">
            <ReferralSection />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;