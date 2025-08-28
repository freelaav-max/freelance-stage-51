
import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { getWhatsAppOptInStatus, updateWhatsAppOptIn } from '@/lib/user';

const WhatsAppOptInBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkOptInStatus = async () => {
      try {
        const { hasOptedIn, userPhone } = await getWhatsAppOptInStatus();
        
        if (!hasOptedIn) {
          setIsVisible(true);
          if (userPhone) {
            setPhone(userPhone);
          }
        }
      } catch (error) {
        console.error('Error checking WhatsApp opt-in status:', error);
      }
    };

    checkOptInStatus();
  }, []);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as Brazilian phone number
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleOptIn = async () => {
    if (!phone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu número de telefone.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateWhatsAppOptIn(true, phone);
      
      setIsVisible(false);
      toast({
        title: "Sucesso!",
        description: "Você receberá notificações via WhatsApp. Verifique sua mensagem de confirmação.",
      });
    } catch (error) {
      console.error('Error opting in for WhatsApp notifications:', error);
      toast({
        title: "Erro",
        description: "Não foi possível ativar as notificações via WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptOut = async () => {
    setIsSubmitting(true);

    try {
      await updateWhatsAppOptIn(false);
      setIsVisible(false);
      
      toast({
        title: "Banner removido",
        description: "Você pode ativar as notificações via WhatsApp nas configurações.",
      });
    } catch (error) {
      console.error('Error opting out from WhatsApp notifications:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50/50">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 fill-green-600" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <h3 className="text-sm font-semibold text-green-800">
                Receba notificações via WhatsApp
              </h3>
            </div>
            
            <p className="text-sm text-green-700 mb-4">
              Mantenha-se atualizado sobre ofertas, bookings e mensagens importantes diretamente no seu WhatsApp. É rápido, seguro e você pode cancelar a qualquer momento.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="+55 (11) 98765-4321"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                    maxLength={20}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleOptIn}
                  disabled={!phone.trim() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Ativar'
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOptOut}
                  disabled={isSubmitting}
                  className="text-green-700 hover:text-green-800 hover:bg-green-100"
                >
                  Agora não
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOptOut}
            className="flex-shrink-0 text-green-600 hover:text-green-800 hover:bg-green-100 -mt-1"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppOptInBanner;
