import React from 'react';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReferralSection from '@/components/referrals/ReferralSection';
import { EarningsSummary } from '@/components/freelancer/EarningsSummary';
import { ReceivablesManager } from '@/components/freelancer/ReceivablesManager';
import { AvailabilityCalendar } from '@/components/freelancer/AvailabilityCalendar';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FreelancerDashboard: React.FC = () => {
  useAuthRequired();
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Dashboard do Freelancer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gerencie sua agenda, pagamentos e ganhos em um só lugar
            </p>
          </div>

          {/* Profile Strength Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Força do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">85% Completo</span>
                  <Button variant="outline" size="sm" onClick={() => navigate('/perfil-freelancer')}>
                    Completar Perfil
                  </Button>
                </div>
                <Progress value={85} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Complete seu perfil para receber mais ofertas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="summary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Resumo</TabsTrigger>
              <TabsTrigger value="calendar">Agenda</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="offers">Ofertas</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <EarningsSummary />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <AvailabilityCalendar />
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <ReceivablesManager />
            </TabsContent>

            <TabsContent value="offers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ofertas da Plataforma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Esta seção mostrará as ofertas recebidas através da plataforma.</p>
                    <p className="text-sm mt-2">Funcionalidade em desenvolvimento.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Referral Section */}
          <ReferralSection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerDashboard;