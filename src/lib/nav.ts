import { User } from '@supabase/supabase-js';

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  description?: string;
  isExternal?: boolean;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  sidebarNav?: NavItem[];
}

export function getNavigationConfig(
  pathname: string, 
  user: User | null
): NavigationConfig {
  // Base navigation for all users
  const baseNav: NavItem[] = [];

  // Guest navigation (not logged in)
  if (!user) {
    return {
      mainNav: [
        ...baseNav,
        {
          title: "Para Clientes",
          href: "/para-clientes",
          description: "Encontre profissionais de áudio e vídeo"
        },
        {
          title: "Para Freelancers", 
          href: "/para-freelancers",
          description: "Ofereça seus serviços"
        },
        {
          title: "Entrar",
          href: "/auth",
          description: "Faça login ou cadastre-se"
        }
      ]
    };
  }

  // Get user type from metadata
  const userType = user.user_metadata?.user_type;

  // Common navigation for authenticated users
  const authNav: NavItem[] = [
    {
      title: "Minhas Ofertas",
      href: "/ofertas",
      description: "Gerencie suas ofertas de trabalho"
    },
    ...baseNav
  ];

  // Client-specific navigation
  if (userType === 'client') {
    return {
      mainNav: [
        {
          title: "Buscar Freelancers",
          href: "/",
          description: "Encontre profissionais"
        },
        ...authNav,
        {
          title: "Meu Perfil",
          href: "/perfil-cliente",
          description: "Gerencie seu perfil"
        }
      ]
    };
  }

  // Freelancer-specific navigation
  if (userType === 'freelancer') {
    return {
      mainNav: [
        {
          title: "Dashboard",
          href: "/dashboard-freelancer",
          description: "Painel do freelancer"
        },
        ...authNav,
        {
          title: "Meu Perfil",
          href: "/perfil",
          description: "Gerencie seu perfil profissional"
        }
      ]
    };
  }

  // Fallback for users without defined type
  return {
    mainNav: [
      {
        title: "Início",
        href: "/",
        description: "Página inicial"
      },
      ...authNav
    ]
  };
}

export function isActiveLink(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
}