
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <img 
            src="/freelaav-logo.png" 
            alt="FreeLaav" 
            className="h-8 w-auto mr-2"
          />
          <span className="text-xl font-bold">FreeLaav</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/ofertas')}>
                Minhas Ofertas
              </Button>
              <Button variant="ghost" onClick={() => navigate('/como-funciona')}>
                Como Funciona
              </Button>
              <NotificationCenter />
              <Button variant="outline" onClick={handleSignOut}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/como-funciona')}>
                Como Funciona
              </Button>
              <Button variant="ghost" onClick={() => navigate('/para-clientes')}>
                Para Clientes
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Entrar
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          {user ? (
            <div className="flex items-center space-x-2">
              <NotificationCenter />
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
