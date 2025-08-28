
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem from './NotificationItem';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { Notification } from '@/types/notification';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { unreadCount, clearUnread } = useRealtimeNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    clearUnread();
    navigate('/ofertas');
  };

  const handleViewAllNotifications = () => {
    navigate('/notificacoes');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 rounded-full hover:bg-muted"
        onClick={handleBellClick}
        title="Ir para Minhas Ofertas"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
};

export default NotificationCenter;
