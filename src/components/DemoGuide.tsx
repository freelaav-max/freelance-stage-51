
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Briefcase, MessageCircle, Calendar, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const DemoGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoUsers = [
    {
      name: 'Mariana Oliveira',
      type: 'Cliente',
      email: 'mariana.cliente@freelaav.com',
      password: 'demo123',
      company: 'Viva Eventos Criativos',
      location: 'São Paulo, SP',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Carlos Silva',
      type: 'Freelancer',
      email: 'carlos.freela@freelaav.com',
      password: 'demo123',
      specialties: ['Técnico de Som', 'Iluminador'],
      location: 'São Paulo, SP',
      hourlyRate: 'R$ 150/hora',
      icon: <User className="h-5 w-5" />,
      color: 'bg-green-100 text-green-800'
    }
  ];

  const demoFlow = [
    {
      title: 'Jornada do Cliente (Mariana)',
      steps: [
        'Login como mariana.cliente@freelaav.com',
        'Buscar por "Técnico de Som" em São Paulo',
        'Visualizar perfil do Carlos Silva',
        'Acessar dashboard de ofertas',
        'Abrir oferta "Evento Corporativo Anual TechCorp"',
        'Interagir no chat da oferta'
      ]
    },
    {
      title: 'Jornada do Freelancer (Carlos)',
      steps: [
        'Logout e login como carlos.freela@freelaav.com',
        'Visualizar oferta pendente no dashboard',
        'Abrir detalhes da oferta da Mariana',
        'Acessar chat e ver mensagens',
        'Aceitar a oferta',
        'Confirmar mudança de status'
      ]
    }
  ];

  const offerDetails = {
    title: 'Evento Corporativo Anual TechCorp',
    description: 'Sonorização completa para auditório com 200 pessoas. Inclui 2 microfones de lapela, 2 de mão e som ambiente para coffee break.',
    date: '30/10/2025',
    time: '09:00 - 18:00',
    location: 'Expo Center Norte - São Paulo, SP',
    budget: 'R$ 1.200,00',
    status: 'Pendente'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">🎬 Guia de Demonstração FreelaAV</h1>
        <p className="text-gray-600">Dados fictícios preparados para apresentação da plataforma</p>
      </div>

      {/* Usuários Demo */}
      <div className="grid md:grid-cols-2 gap-6">
        {demoUsers.map((user, index) => (
          <Card key={index} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {user.icon}
                <span>{user.name}</span>
                <Badge className={user.color}>{user.type}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email:</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(user.email)}
                  >
                    {user.email}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Senha:</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(user.password)}
                  >
                    {user.password}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{user.location}</span>
                </div>
                
                {user.company && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{user.company}</span>
                  </div>
                )}
                
                {user.hourlyRate && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{user.hourlyRate}</span>
                  </div>
                )}
                
                {user.specialties && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-600">Especialidades:</span>
                    <div className="flex flex-wrap gap-1">
                      {user.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detalhes da Oferta Demo */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Calendar className="h-5 w-5" />
            Oferta de Demonstração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">{offerDetails.title}</h4>
              <p className="text-sm text-gray-600">{offerDetails.description}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{offerDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{offerDetails.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{offerDetails.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-green-600">{offerDetails.budget}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border">
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Mensagens já criadas no chat:
            </h5>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Carlos:</strong> "Olá, Mariana! Obrigado pelo interesse. O Rider técnico está completo..."</p>
              <p><strong>Mariana:</strong> "Oi, Carlos! O Rider é esse mesmo. Apenas o básico para palestras..."</p>
              <p><strong>Carlos:</strong> "Perfeito, atende sim. Tenho tudo o que é necessário. Pode confirmar a oferta!"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluxo de Demonstração */}
      <div className="grid md:grid-cols-2 gap-6">
        {demoFlow.map((flow, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{flow.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {flow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {stepIndex + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botões de Ação Rápida */}
      <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Ver Credenciais
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Credenciais de Acesso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {demoUsers.map((user, index) => (
                <div key={index} className="p-3 border rounded">
                  <h4 className="font-semibold">{user.name} ({user.type})</h4>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Senha: {user.password}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={() => window.location.href = '/auth'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Iniciar Demonstração
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <p>💡 <strong>Dica:</strong> Use as credenciais acima para fazer login e demonstrar o fluxo completo da plataforma</p>
      </div>
    </div>
  );
};
