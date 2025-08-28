import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Mock data - would come from API
  const activeBookings = [
    {
      id: '1',
      freelancerName: 'Carlos Silva',
      service: 'Técnico de Som',
      date: '2025-01-25',
      time: '14:00',
      location: 'São Paulo - SP',
      status: 'confirmed',
      amount: 800
    },
    {
      id: '2',
      freelancerName: 'Ana Rodrigues',
      service: 'Operadora de Câmera',
      date: '2025-01-28',
      time: '09:00',
      location: 'Rio de Janeiro - RJ',
      status: 'pending_payment',
      amount: 1200
    }
  ];

  const pastBookings = [
    {
      id: '3',
      freelancerName: 'Marcos Oliveira',
      service: 'Iluminador',
      date: '2025-01-15',
      location: 'Belo Horizonte - MG',
      status: 'completed',
      rating: 5
    }
  ];

  const favoriteFreelancers = [
    {
      id: '1',
      name: 'Carlos Silva',
      specialty: 'Técnico de Som',
      rating: 4.9,
      location: 'São Paulo - SP'
    },
    {
      id: '2',
      name: 'Ana Rodrigues',
      specialty: 'Operadora de Câmera',
      rating: 5.0,
      location: 'Rio de Janeiro - RJ'
    }
  ];

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
                    <p className="text-2xl font-bold">{activeBookings.length}</p>
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
                    <p className="text-2xl font-bold">{pastBookings.length}</p>
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
                    <p className="text-2xl font-bold">{favoriteFreelancers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gasto Total</p>
                    <p className="text-2xl font-bold">R$ 2.000</p>
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
              {activeBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{booking.freelancerName}</h3>
                          <Badge variant="secondary">{booking.service}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.location}
                          </div>
                        </div>
                        <div className="text-lg font-semibold">
                          R$ {booking.amount.toLocaleString('pt-BR')}
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
              ))}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{booking.freelancerName}</h3>
                          <Badge variant="secondary">{booking.service}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(booking.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm">{booking.rating}</span>
                        </div>
                        <Badge variant="outline">Concluído</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favoriteFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{freelancer.name}</h3>
                          <Badge variant="secondary">{freelancer.specialty}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {freelancer.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {freelancer.location}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientDashboard;