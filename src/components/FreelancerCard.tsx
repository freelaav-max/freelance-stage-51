import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FreelancerSearchResult } from '@/hooks/useFreelancerSearch';
import { MapPin, Star, Heart, Camera, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FreelancerCardProps {
  freelancer: FreelancerSearchResult;
}

const FreelancerCard = ({ freelancer }: FreelancerCardProps) => {
  const {
    id,
    hourly_rate,
    experience_years,
    rating,
    total_reviews,
    is_pro_member,
    specialties,
    portfolio,
    user
  } = freelancer;

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      is_pro_member && "ring-2 ring-primary/20 shadow-lg"
    )}>
      {/* Pro Badge */}
      {is_pro_member && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
            <Crown className="w-3 h-3 mr-1" />
            PRO
          </Badge>
        </div>
      )}

      <CardContent className="p-4">
        {/* Header com Avatar e Info Básica */}
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getUserInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate mb-1">
              {user.full_name}
            </h3>
            
            {/* Localização */}
            {(user.city || user.state) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">
                  {user.city}{user.city && user.state && ', '}{user.state}
                </span>
              </div>
            )}
            
            {/* Rating e Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({total_reviews} {total_reviews === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="flex flex-wrap gap-1 mb-4">
          {specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{specialties.length - 3}
            </Badge>
          )}
        </div>

        {/* Portfolio Preview */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-3 gap-1 mb-4">
            {portfolio.slice(0, 3).map((item, index) => (
              <div key={item.id} className="aspect-square rounded-md overflow-hidden bg-muted">
                {item.media_type === 'image' ? (
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Preço e Experiência */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">A partir de </span>
            <span className="font-bold text-lg text-primary">
              {formatPrice(hourly_rate)}/h
            </span>
          </div>
          <div className="text-muted-foreground">
            {experience_years} {experience_years === 1 ? 'ano' : 'anos'} exp.
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button asChild className="flex-1">
            <Link to={`/freelancer/${id}`}>
              Ver Perfil
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FreelancerCard;