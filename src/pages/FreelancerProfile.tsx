import React from 'react';
import { useAuthRequired } from '@/hooks/useAuthRequired';
import { FreelancerProfileForm } from '@/components/FreelancerProfileForm';

const FreelancerProfile: React.FC = () => {
  const { loading } = useAuthRequired();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações profissionais e portfolio
          </p>
        </div>
        <FreelancerProfileForm />
      </div>
    </div>
  );
};

export default FreelancerProfile;