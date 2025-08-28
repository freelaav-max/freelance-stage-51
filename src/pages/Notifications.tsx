
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bell, BellOff, Smartphone, MessageSquare, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationItem from '@/components/notifications/NotificationItem';
import WhatsAppOptInBanner from '@/components/notifications/WhatsAppOptInBanner';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const { loading } = useAuthRequired();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    notifications,
    preferences,
    isLoading,
    preferencesLoading,
    updatePreferences,
  } = useNotifications();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleTogglePreference = (category: 'inApp' | 'whatsapp', key: string, value: boolean) => {
    if (!preferences) return;
    
    const newPreferences = {
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: value
      }
    };
    
    updatePreferences(newPreferences);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Notificações</h1>
            <p className="text-muted-foreground">
              Gerencie suas notificações e preferências de comunicação
            </p>
          </div>

          <WhatsAppOptInBanner />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Preferences Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferências
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {preferencesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      {/* In-App Notifications */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Bell className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">Plataforma</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { key: 'offers', label: 'Novas ofertas' },
                            { key: 'bookings', label: 'Atualizações de bookings' },
                            { key: 'payments', label: 'Pagamentos' },
                            { key: 'messages', label: 'Novas mensagens' },
                            { key: 'reviews', label: 'Avaliações' },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between">
                              <label className="text-sm text-foreground">{label}</label>
                              <Switch
                                checked={preferences?.inApp?.[key as keyof typeof preferences.inApp] || false}
                                onCheckedChange={(checked) => 
                                  handleTogglePreference('inApp', key, checked)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* WhatsApp Notifications */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                          <h3 className="font-semibold">WhatsApp</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { key: 'offers', label: 'Novas ofertas' },
                            { key: 'bookings', label: 'Atualizações de bookings' },
                            { key: 'payments', label: 'Pagamentos' },
                            { key: 'messages', label: 'Novas mensagens' },
                            { key: 'reviews', label: 'Avaliações' },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between">
                              <label className="text-sm text-foreground">{label}</label>
                              <Switch
                                checked={preferences?.whatsapp?.[key as keyof typeof preferences.whatsapp] || false}
                                onCheckedChange={(checked) => 
                                  handleTogglePreference('whatsapp', key, checked)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Notificações</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : notifications.length > 0 ? (
                    <Tabs defaultValue="unread" className="w-full">
                      <div className="px-6 pt-2">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="unread">
                            Não lidas ({unreadNotifications.length})
                          </TabsTrigger>
                          <TabsTrigger value="read">
                            Lidas ({readNotifications.length})
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="unread" className="mt-0">
                        <ScrollArea className="max-h-96">
                          {unreadNotifications.length > 0 ? (
                            unreadNotifications.map(notification => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => {
                                  // Handle notification click
                                  console.log('Clicked notification:', notification.id);
                                }}
                              />
                            ))
                          ) : (
                            <div className="p-8 text-center text-muted-foreground">
                              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>Nenhuma notificação não lida</p>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="read" className="mt-0">
                        <ScrollArea className="max-h-96">
                          {readNotifications.length > 0 ? (
                            readNotifications.map(notification => (
                              <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => {
                                  // Handle notification click
                                  console.log('Clicked notification:', notification.id);
                                }}
                              />
                            ))
                          ) : (
                            <div className="p-8 text-center text-muted-foreground">
                              <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>Nenhuma notificação lida</p>
                            </div>
                          )}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Nenhuma notificação</p>
                      <p className="text-sm">
                        Quando você receber notificações, elas aparecerão aqui
                      </p>
                    </div>
                  )}
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

export default NotificationsPage;
