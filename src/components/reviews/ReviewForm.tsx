import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  bookingId: string;
  receiverId: string;
  receiverName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  receiverId,
  receiverName,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (!user?.id || rating === 0) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          giver_id: user.id,
          receiver_id: receiverId,
          rating,
          comment: comment.trim() || null,
        });

      if (error) throw error;

      // Update freelancer's average rating
      const { error: updateError } = await supabase.rpc('update_freelancer_rating', {
        freelancer_id: receiverId,
      });

      if (updateError) {
        console.warn('Failed to update freelancer rating:', updateError);
      }

      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso.",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erro ao enviar avaliação",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Avaliar {receiverName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sua avaliação</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </motion.button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "Muito ruim"}
              {rating === 2 && "Ruim"}
              {rating === 3 && "Regular"}
              {rating === 4 && "Bom"}
              {rating === 5 && "Excelente"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Comentário (opcional)
          </label>
          <Textarea
            id="comment"
            placeholder="Compartilhe sua experiência..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
          
          <Button 
            onClick={handleSubmitReview}
            disabled={loading || rating === 0}
            className="flex-1"
          >
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};