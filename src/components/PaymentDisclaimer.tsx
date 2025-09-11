import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface PaymentDisclaimerProps {
  variant?: 'default' | 'warning';
  className?: string;
}

export const PaymentDisclaimer: React.FC<PaymentDisclaimerProps> = ({ 
  variant = 'default',
  className 
}) => {
  return (
    <Alert className={className}>
      {variant === 'warning' ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Shield className="h-4 w-4" />
      )}
      <AlertDescription>
        <strong>Pagamento Independente:</strong> Esta plataforma não processa pagamentos. 
        Todos os pagamentos devem ser realizados diretamente entre cliente e freelancer. 
        A plataforma não possui responsabilidade sobre transações financeiras.
      </AlertDescription>
    </Alert>
  );
};