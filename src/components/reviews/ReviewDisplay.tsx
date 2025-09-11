import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  giver: {
    full_name: string;
    avatar_url?: string;
  };
  response?: string;
  responded_at?: string;
}

interface ReviewDisplayProps {
  reviews: Review[];
  showResponse?: boolean;
}

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  reviews,
  showResponse = false,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma avaliação ainda
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.giver.avatar_url} />
                <AvatarFallback>
                  {review.giver.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.giver.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), "d 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.comment && (
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                )}

                {showResponse && review.response && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Resposta do freelancer:
                    </p>
                    <p className="text-sm">{review.response}</p>
                    {review.responded_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(review.responded_at), "d 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};