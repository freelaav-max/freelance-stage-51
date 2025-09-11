import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  freelancerId: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  freelancerId,
  size = 'default',
  variant = 'ghost',
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [user?.id, freelancerId]);

  const checkFavoriteStatus = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('freelancer_id', freelancerId)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!user?.id) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar freelancers",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('freelancer_id', freelancerId);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: "Removido dos favoritos",
          description: "Freelancer removido da sua lista de favoritos",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            freelancer_id: freelancerId,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: "Adicionado aos favoritos",
          description: "Freelancer adicionado à sua lista de favoritos",
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleFavorite}
      disabled={loading}
      className="p-2"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite
              ? 'fill-red-500 text-red-500'
              : 'text-muted-foreground hover:text-red-500'
          }`}
        />
      </motion.div>
    </Button>
  );
};