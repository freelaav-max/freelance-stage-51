import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CalendarDays,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  MessageSquare,
  Star,
  Download,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';

const BookingDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading } = useAuthRequired();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Mock data - would come from API based on booking ID
  const booking = {
    id: id || '1',
    clientName: 'Maria Santos',
    clientEmail: 'maria@empresa.com',
    clientPhone: '(11) 99999-9999',
    freelancerName: 'Carlos Silva',
    freelancerEmail: 'carlos@freelancer.com',
    freelancerPhone: '(11) 88888-8888',
    service: 'Técnico de Som',
    description: 'Evento corporativo para 200 pessoas com apresentações e networking.',
    date: '2025-01-30',
    time: '14:00',
    duration: 8,
    location: 'Centro de Convenções - São Paulo, SP',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    totalAmount: 800,
    depositAmount: 240, // 30%
    remainingAmount: 560,
    status: 'confirmed', // confirmed, in_progress, completed, cancelled
    paymentStatus: 'deposit_paid', // pending, deposit_paid, fully_paid
    contractUrl: '/contracts/booking_1.pdf',
    createdAt: '2025-01-20',
    eventRequirements: [
      'Sistema de som para 200 pessoas',
      'Microfones sem fio (2x)',
      'Mesa de som digital',
      'Caixas de retorno para palestrantes'
    ],
    notes: 'Cliente enfatizou a importância da qualidade do áudio para as apresentações.'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-500">Confirmado</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">Em Andamento</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'fully_paid':
        return <Badge className="bg-green-500">Pago Integralmente</Badge>;
      case 'deposit_paid':
        return <Badge className="bg-blue-500">Sinal Pago</Badge>;
      case 'pending':
        return <Badge variant="destructive">Pagamento Pendente</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
                ← Voltar
              </Button>
              <h1 className="text-3xl font-bold mb-2">Detalhes do Booking</h1>
              <p className="text-muted-foreground">Booking #{booking.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
              {getPaymentStatusBadge(booking.paymentStatus)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Detalhes do Evento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{booking.service}</h3>
                    <p className="text-muted-foreground">{booking.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.time} ({booking.duration}h de duração)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>R$ {booking.totalAmount.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Endereço completo:</p>
                    <p>{booking.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos do Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {booking.eventRequirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Observações:</h4>
                      <p className="text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Detalhes de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Valor total:</span>
                      <span className="font-semibold">R$ {booking.totalAmount.toLocaleString('pt-BR')}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Sinal (30%):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">R$ {booking.depositAmount.toLocaleString('pt-BR')}</span>
                        {booking.paymentStatus === 'deposit_paid' || booking.paymentStatus === 'fully_paid' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Restante (70%):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">R$ {booking.remainingAmount.toLocaleString('pt-BR')}</span>
                        {booking.paymentStatus === 'fully_paid' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {booking.paymentStatus === 'deposit_paid' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">
                          O pagamento restante será liberado após a conclusão do evento.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cliente</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.clientName}</p>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{booking.clientEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{booking.clientPhone}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Freelancer</h4>
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback>{booking.freelancerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.freelancerName}</p>
                        <p className="text-sm text-muted-foreground">Freelancer</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{booking.freelancerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{booking.freelancerPhone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                  
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Contrato
                  </Button>

                  {booking.status === 'completed' && (
                    <Button className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Avaliar
                    </Button>
                  )}

                  {booking.status === 'confirmed' && new Date(booking.date) > new Date() && (
                    <Button className="w-full" variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Cancelar Booking
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Booking confirmado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    {booking.paymentStatus === 'deposit_paid' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">Sinal pago</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetails;