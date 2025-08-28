
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Menu, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getSearchPlaceholder = () => {
    if (typeof window === 'undefined') return "Buscar freelancers...";
    
    const width = window.innerWidth;
    if (width < 640) return "Buscar freelancers...";
    if (width < 1024) return "Buscar freelancers, especialidades...";
    return "Buscar freelancers, especialidades, localização...";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="flex h-14 items-center justify-between md:hidden">
          {/* Logo - Mobile */}
          <div 
            className="flex items-center cursor-pointer flex-shrink-0 min-w-0" 
            onClick={() => navigate('/')}
          >
            <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FreelaAV
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {user && <NotificationCenter />}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback className="bg-gradient-primary text-white text-xs">
                        {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.user_metadata?.full_name || 'Usuário'}</p>
                      <p className="w-[180px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/notificacoes')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Notificações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button size="sm" className="btn-gradient text-xs px-3" onClick={() => navigate('/auth')}>
                  Entrar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-16 items-center">
          {/* Logo - Desktop */}
          <div className="mr-8 flex items-center flex-shrink-0">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                FreelaAV
              </div>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="flex flex-1 items-center justify-center max-w-2xl mx-auto min-w-0">
            <div className="relative w-full min-w-0">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex-shrink-0" />
              <input
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm pl-12 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground placeholder:truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all min-w-0"
                placeholder={getSearchPlaceholder()}
                type="search"
              />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-4 ml-8 flex-shrink-0">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={() => navigate('/para-freelancers')}>
                  Para Freelancers
                </Button>
                <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={() => navigate('/para-clientes')}>
                  Para Clientes
                </Button>
                
                <NotificationCenter />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-4">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.user_metadata?.full_name || 'Usuário'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/notificacoes')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Notificações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={() => navigate('/para-clientes')}>
                  Para Clientes
                </Button>
                <Button size="sm" className="btn-gradient" onClick={() => navigate('/auth')}>
                  Entrar
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                  Cadastrar
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar - Below header */}
        <div className="md:hidden pb-3">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex-shrink-0" />
            <input
              className="flex h-10 w-full rounded-lg border border-input bg-background/50 backdrop-blur-sm pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground placeholder:truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all min-w-0"
              placeholder="Buscar freelancers..."
              type="search"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
