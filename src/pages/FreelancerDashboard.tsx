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
import { Progress } from '@/components/ui/progress';
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Bell,
  Eye,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FreelancerDashboard: React.FC = () => {
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
  const pendingOffers = [
    {
      id: '1',
      clientName: 'Maria Santos',
      service: 'Técnico de Som',
      date: '2025-01-30',
      time: '15:00',
      location: 'São Paulo - SP',
      budget: 800,
      description: 'Evento corporativo para 200 pessoas',
      sentAt: '2025-01-20'
    },
    {
      id: '2',
      clientName: 'João Oliveira',
      service: 'Operação de Câmera',
      date: '2025-02-05',
      time: '10:00',
      location: 'São Paulo - SP',
      budget: 1500,
      description: 'Casamento em salão de festas',
      sentAt: '2025-01-21'
    }
  ];

  const upcomingBookings = [
    {
      id: '1',
      clientName: 'Carlos Silva',
      service: 'Técnico de Som',
      date: '2025-01-25',
      time: '14:00',
      location: 'São Paulo - SP',
      amount: 800,
      status: 'confirmed'
    }
  ];

  const recentEarnings = [
    {
      id: '1',
      clientName: 'Ana Costa',
      service: 'Iluminação',
      date: '2025-01-15',
      amount: 600,
      status: 'paid'
    },
    {
      id: '2',
      clientName: 'Pedro Santos',
      service: 'Técnico de Som',
      date: '2025-01-10',
      amount: 900,
      status: 'paid'
    }
  ];

  const stats = {
    profileStrength: 85,
    totalEarnings: 15000,
    completedJobs: 23,
    averageRating: 4.8,
    monthlyGrowth: 12
  };

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
              <h1 className="text-3xl font-bold mb-2">Dashboard Freelancer</h1>
              <p className="text-muted-foreground">Gerencie suas ofertas e acompanhe seus ganhos</p>
            </div>
            <Button onClick={() => navigate('/profile')} variant="outline">
              Editar Perfil
            </Button>
          </div>

          {/* Profile Strength Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Força do Perfil</h3>
                <Badge variant={stats.profileStrength >= 80 ? 'default' : 'secondary'}>
                  {stats.profileStrength}%
                </Badge>
              </div>
              <Progress value={stats.profileStrength} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {stats.profileStrength >= 80 ? 
                  'Seu perfil está otimizado! Continue assim.' : 
                  'Complete seu perfil para receber mais ofertas.'
                }
              </p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ofertas Pendentes</p>
                    <p className="text-2xl font-bold">{pendingOffers.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ganhos Totais</p>
                    <p className="text-2xl font-bold">R$ {stats.totalEarnings.toLocaleString('pt-BR')}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trabalhos Concluídos</p>
                    <p className="text-2xl font-bold">{stats.completedJobs}</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                    <p className="text-2xl font-bold">{stats.averageRating}</p>
                  </div>
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="offers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="offers">Ofertas ({pendingOffers.length})</TabsTrigger>
              <TabsTrigger value="bookings">Próximos Trabalhos</TabsTrigger>
              <TabsTrigger value="earnings">Ganhos</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
            </TabsList>

            <TabsContent value="offers" className="space-y-4">
              {pendingOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{offer.clientName}</h3>
                          <Badge variant="secondary">{offer.service}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(offer.date).toLocaleDateString('pt-BR')} às {offer.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {offer.location}
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-primary">
                          R$ {offer.budget.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Recusar
                        </Button>
                        <Button size="sm">
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingOffers.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhuma oferta pendente no momento.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{booking.clientName}</h3>
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
                        <Badge variant="default">Confirmado</Badge>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                      <p className="text-2xl font-bold">R$ 3.200</p>
                      <p className="text-sm text-green-600">+{stats.monthlyGrowth}% vs mês anterior</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Último Mês</p>
                      <p className="text-2xl font-bold">R$ 2.850</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">R$ {stats.totalEarnings.toLocaleString('pt-BR')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {recentEarnings.map((earning) => (
                <Card key={earning.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{earning.clientName}</h3>
                        <p className="text-sm text-muted-foreground">{earning.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(earning.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">R$ {earning.amount.toLocaleString('pt-BR')}</p>
                        <Badge variant="default">Pago</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Visualizações do Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">124</div>
                    <p className="text-sm text-muted-foreground">+18% esta semana</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Taxa de Conversão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">23%</div>
                    <p className="text-sm text-muted-foreground">Ofertas aceitas vs visualizações</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Especialidades</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Técnico de Som</span>
                      <span className="font-semibold">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Iluminação</span>
                      <span className="font-semibold">40%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Clientes Recorrentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">8</div>
                    <p className="text-sm text-muted-foreground">35% dos seus clientes</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FreelancerDashboard;