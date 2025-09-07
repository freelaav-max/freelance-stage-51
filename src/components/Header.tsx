
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { mainNav, isActive } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-top">
      <div className="container mx-auto px-4 py-2 md:py-4 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <img 
            src="/lovable-uploads/c127466c-6a9e-4bef-bb44-66895ef039fb.png"
            alt="FreelaAV" 
            className="h-10 w-auto"
            onError={(e) => {
              console.error('Failed to load logo');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {mainNav.slice(0, -1).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => 
                `transition-colors hover:text-foreground/80 ${
                  isActive ? 'text-foreground font-medium' : 'text-foreground/60'
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
          
          {user && <NotificationCenter />}
          
          {/* Last nav item (Entrar/Sair) as button */}
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sair
            </Button>
          ) : (
            <Button onClick={() => navigate('/auth')}>
              Entrar
            </Button>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center space-x-2">
          {user && <NotificationCenter />}
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-3 min-h-11 min-w-11">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {mainNav.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left p-3 rounded-md transition-colors ${
                      isActive(item.href) 
                        ? 'bg-accent text-accent-foreground font-medium' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    )}
                  </button>
                ))}
                
                {user && (
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="w-full mt-4"
                  >
                    Sair
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
