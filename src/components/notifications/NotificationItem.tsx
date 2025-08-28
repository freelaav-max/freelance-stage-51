
import React from 'react';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Bell,
  Calendar,
  CreditCard,
  MessageCircle,
  Star,
  FileText,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClick 
}) => {
  const getIcon = () => {
    const iconClass = "h-5 w-5";
    
    switch (notification.type) {
      case 'offer':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'booking':
        return <Calendar className={`${iconClass} text-green-500`} />;
      case 'payment':
        return <CreditCard className={`${iconClass} text-purple-500`} />;
      case 'message':
        return <MessageCircle className={`${iconClass} text-yellow-500`} />;
      case 'review':
        return <Star className={`${iconClass} text-orange-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getWhatsAppStatusIcon = () => {
    switch (notification.whatsAppStatus) {
      case 'sent':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-400" />;
      case 'read':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'failed':
        return <X className="h-3 w-3 text-red-400" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    return formatDistance(new Date(date), new Date(), {
      addSuffix: true,
      locale: ptBR,
    });
  };
  
  return (
    <div 
      className={`p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex">
        <div className="mr-3 flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.content}</p>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <span>{formatTimeAgo(notification.createdAt)}</span>
            
            {notification.sentToWhatsApp && (
              <div className="ml-3 flex items-center gap-1">
                <svg className="h-3 w-3 fill-green-500" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {getWhatsAppStatusIcon()}
              </div>
            )}
          </div>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
