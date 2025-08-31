import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'online' | 'offline';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: {
      label: 'Pendente',
      className: 'bg-warning/10 text-warning border-warning/20'
    },
    accepted: {
      label: 'Aceito',
      className: 'bg-success/10 text-success border-success/20'
    },
    rejected: {
      label: 'Recusado',
      className: 'bg-destructive/10 text-destructive border-destructive/20'
    },
    completed: {
      label: 'Concluído',
      className: 'bg-primary/10 text-primary border-primary/20'
    },
    online: {
      label: '🟢 Online',
      className: 'bg-success/10 text-success border-success/20'
    },
    offline: {
      label: '⚫ Offline',
      className: 'bg-muted/50 text-muted-foreground border-muted/20'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};