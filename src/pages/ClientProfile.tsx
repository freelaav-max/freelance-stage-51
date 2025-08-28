import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Settings,
  Bell,
  CreditCard,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientProfile: React.FC = () => {
  const { loading } = useAuthRequired();
  const { toast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [profileData, setProfileData] = useState({
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    phone: '(11) 99999-9999',
    company: 'Eventos Premium Ltda',
    position: 'Diretora de Eventos',
    city: 'São Paulo',
    state: 'SP',
    bio: 'Profissional com mais de 10 anos de experiência em eventos corporativos e sociais.'
  });

  const [notifications, setNotifications] = useState({
    newOffers: true,
    bookingUpdates: true,
    paymentReminders: true,
    promotions: false,
    newsletter: true
  });

  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  const handleSaveProfile = () => {
    // Would save to API
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const saveNotifications = () => {
    // Would save to API
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações e preferências</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {profileData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{profileData.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{profileData.position}</p>
                  <p className="text-muted-foreground text-sm">{profileData.company}</p>
                  
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.city}, {profileData.state}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{profileData.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pagamentos
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Segurança
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Informações Pessoais</CardTitle>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        >
                          {isEditing ? 'Salvar' : 'Editar'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome completo</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Empresa</Label>
                          <Input
                            id="company"
                            value={profileData.company}
                            onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Cargo</Label>
                          <Input
                            id="position"
                            value={profileData.position}
                            onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Sobre</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Conte um pouco sobre você e sua empresa..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências de Notificação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Novas ofertas</h4>
                            <p className="text-sm text-muted-foreground">
                              Receber notificações quando freelancers responderem suas ofertas
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.newOffers}
                            onChange={(e) => handleNotificationChange('newOffers', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Atualizações de booking</h4>
                            <p className="text-sm text-muted-foreground">
                              Notificações sobre mudanças no status dos seus bookings
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.bookingUpdates}
                            onChange={(e) => handleNotificationChange('bookingUpdates', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Lembretes de pagamento</h4>
                            <p className="text-sm text-muted-foreground">
                              Receber lembretes sobre pagamentos pendentes
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.paymentReminders}
                            onChange={(e) => handleNotificationChange('paymentReminders', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Promoções</h4>
                            <p className="text-sm text-muted-foreground">
                              Receber ofertas especiais e descontos
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.promotions}
                            onChange={(e) => handleNotificationChange('promotions', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Newsletter</h4>
                            <p className="text-sm text-muted-foreground">
                              Receber dicas e novidades sobre o mercado de eventos
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.newsletter}
                            onChange={(e) => handleNotificationChange('newsletter', e.target.checked)}
                            className="h-4 w-4"
                          />
                        </div>
                      </div>

                      <Button onClick={saveNotifications}>
                        Salvar Preferências
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métodos de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Gerencie seus métodos de pagamento para facilitar futuras contratações.
                        </p>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-6 w-6" />
                              <div>
                                <p className="font-medium">Cartão de Crédito</p>
                                <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </div>

                        <Button variant="outline">
                          Adicionar Método de Pagamento
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Segurança da Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Alterar Senha</h4>
                          <div className="space-y-3 max-w-md">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Senha atual</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">Nova senha</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                            <Button>Alterar Senha</Button>
                          </div>
                        </div>

                        <div className="pt-6 border-t">
                          <h4 className="font-medium mb-2">Exclusão da Conta</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ao excluir sua conta, todos os seus dados serão removidos permanentemente.
                          </p>
                          <Button variant="destructive">
                            Excluir Conta
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientProfile;