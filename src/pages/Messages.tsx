import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  CalendarDays,
  MapPin,
  DollarSign
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'offer' | 'system';
}

interface Conversation {
  id: string;
  otherUserName: string;
  otherUserType: 'client' | 'freelancer';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  offerDetails?: {
    service: string;
    date: string;
    location: string;
    budget: number;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

const Messages: React.FC = () => {
  const { loading } = useAuthRequired();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  // Mock data
  const conversations: Conversation[] = [
    {
      id: '1',
      otherUserName: 'Maria Santos',
      otherUserType: 'client',
      lastMessage: 'Perfeito! Aguardo confirmação.',
      lastMessageTime: '10:30',
      unreadCount: 2,
      offerDetails: {
        service: 'Técnico de Som',
        date: '2025-01-30',
        location: 'São Paulo - SP',
        budget: 800,
        status: 'pending'
      }
    },
    {
      id: '2',
      otherUserName: 'Carlos Silva',
      otherUserType: 'freelancer',
      lastMessage: 'Obrigado pela oportunidade!',
      lastMessageTime: 'Ontem',
      unreadCount: 0,
      offerDetails: {
        service: 'Operação de Câmera',
        date: '2025-02-05',
        location: 'Rio de Janeiro - RJ',
        budget: 1200,
        status: 'accepted'
      }
    },
    {
      id: '3',
      otherUserName: 'Ana Costa',
      otherUserType: 'client',
      lastMessage: 'Vou analisar sua proposta.',
      lastMessageTime: '2 dias',
      unreadCount: 0
    }
  ];

  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        senderId: 'other',
        content: 'Olá! Vi seu perfil e gostaria de contratá-lo para um evento.',
        timestamp: '09:15',
        type: 'text'
      },
      {
        id: '2',
        senderId: 'me',
        content: 'Olá Maria! Obrigado pelo interesse. Pode me dar mais detalhes sobre o evento?',
        timestamp: '09:20',
        type: 'text'
      },
      {
        id: '3',
        senderId: 'other',
        content: 'É um evento corporativo para 200 pessoas. Preciso de técnico de som.',
        timestamp: '09:25',
        type: 'text'
      },
      {
        id: '4',
        senderId: 'system',
        content: 'Nova oferta recebida',
        timestamp: '09:30',
        type: 'offer'
      },
      {
        id: '5',
        senderId: 'other',
        content: 'Perfeito! Aguardo confirmação.',
        timestamp: '10:30',
        type: 'text'
      }
    ]
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    // Would send message via API
    setMessageInput('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="h-[calc(100vh-200px)]"
        >
          <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* Conversations List */}
            <div className="w-full lg:w-1/3 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Mensagens</h1>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedConversation === conversation.id ? 'bg-muted/50 border-primary' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {conversation.otherUserName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold truncate">
                                {conversation.otherUserName}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {conversation.lastMessageTime}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.offerDetails && (
                              <Badge 
                                variant={conversation.offerDetails.status === 'pending' ? 'default' : 'secondary'} 
                                className="mt-2"
                              >
                                {conversation.offerDetails.status === 'pending' ? 'Oferta Pendente' : 
                                 conversation.offerDetails.status === 'accepted' ? 'Oferta Aceita' : 'Oferta Recusada'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {currentConversation?.otherUserName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{currentConversation?.otherUserName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {currentConversation?.otherUserType === 'client' ? 'Cliente' : 'Freelancer'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Offer Details */}
                      {currentConversation?.offerDetails && (
                        <Card className="mt-4 bg-muted/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">Detalhes da Oferta</h4>
                              <Badge variant={currentConversation.offerDetails.status === 'pending' ? 'default' : 'secondary'}>
                                {currentConversation.offerDetails.status === 'pending' ? 'Pendente' : 
                                 currentConversation.offerDetails.status === 'accepted' ? 'Aceita' : 'Recusada'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{currentConversation.offerDetails.service}</Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                R$ {currentConversation.offerDetails.budget.toLocaleString('pt-BR')}
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {new Date(currentConversation.offerDetails.date).toLocaleDateString('pt-BR')}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {currentConversation.offerDetails.location}
                              </div>
                            </div>
                            {currentConversation.offerDetails.status === 'pending' && (
                              <div className="flex gap-2 mt-4">
                                <Button variant="outline" size="sm">Recusar</Button>
                                <Button size="sm">Aceitar</Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>

                  {/* Messages */}
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 p-4">
                      {currentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type === 'system' ? (
                            <div className="bg-muted p-3 rounded-lg text-center text-sm">
                              {message.content}
                            </div>
                          ) : (
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.senderId === 'me'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="flex-1 flex items-center justify-center">
                  <CardContent className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Selecione uma conversa</h3>
                    <p className="text-muted-foreground">
                      Escolha uma conversa da lista para começar a trocar mensagens
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;