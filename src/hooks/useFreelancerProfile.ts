import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getFreelancerProfile, 
  getFreelancerSpecialties, 
  getPortfolioItems,
  FreelancerProfileWithUser,
  PortfolioItem 
} from '@/lib/freelancer';

export const useFreelancerProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const [profile, setProfile] = useState<FreelancerProfileWithUser | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUserId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileData, specialtiesData, portfolioData] = await Promise.all([
          getFreelancerProfile(targetUserId),
          getFreelancerSpecialties(targetUserId),
          getPortfolioItems(targetUserId)
        ]);

        setProfile(profileData);
        setSpecialties(specialtiesData);
        setPortfolioItems(portfolioData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  const refetch = async () => {
    if (!targetUserId) return;
    
    try {
      setError(null);
      const [profileData, specialtiesData, portfolioData] = await Promise.all([
        getFreelancerProfile(targetUserId),
        getFreelancerSpecialties(targetUserId),
        getPortfolioItems(targetUserId)
      ]);

      setProfile(profileData);
      setSpecialties(specialtiesData);
      setPortfolioItems(portfolioData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recarregar perfil');
    }
  };

  return {
    profile,
    specialties,
    portfolioItems,
    loading,
    error,
    refetch
  };
};