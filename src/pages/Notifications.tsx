
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const { clearUnread } = useRealtimeNotifications();

  useEffect(() => {
    // Clear notifications when accessing this page
    clearUnread();
    
    // Redirect to offers page since that's where notifications are handled
    navigate('/ofertas', { replace: true });
  }, [navigate, clearUnread]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Redirecionando para suas ofertas...</div>
      </div>
    </div>
  );
};

export default Notifications;
