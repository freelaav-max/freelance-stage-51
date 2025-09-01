import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getNavigationConfig, isActiveLink, type NavigationConfig } from '@/lib/nav';

export function useNavigation(): NavigationConfig & {
  isActive: (href: string) => boolean;
  currentPath: string;
} {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const config = getNavigationConfig(pathname, user);
  
  return {
    ...config,
    isActive: (href: string) => isActiveLink(pathname, href),
    currentPath: pathname
  };
}