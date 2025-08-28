import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, DollarSign, Camera, MessageCircle, Heart } from 'lucide-react';
import { useFreelancerProfile } from '@/hooks/useFreelancerProfile';
import { SPECIALTIES } from '@/lib/freelancer';
import { AvailabilityDisplay } from '@/components/AvailabilityDisplay';

const FreelancerPublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, specialties, portfolioItems, loading, error } = useFreelancerProfile(id);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando perfil...</div>;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Perfil não encontrado</h2>
        <p className="text-muted-foreground">O freelancer que você está procurando não existe.</p>
      </div>
    );
  }

  const specialtyLabels = specialties.map(specialty => {
    const found = SPECIALTIES.find(s => s.value === specialty);
    return found ? found.label : specialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {profile.profiles?.full_name?.charAt(0) || <Camera className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-2xl font-bold">{profile.profiles?.full_name}</h1>
                    <div className="flex items-center justify-center mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profile.profiles?.city || profile.city}, {profile.profiles?.state || profile.state}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{profile.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted-foreground">({profile.total_reviews || 0} avaliações)</span>
                  </div>

                  <div className="flex space-x-2 w-full">
                    <Button className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Oferta
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.experience_years && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.experience_years} anos de experiência</span>
                  </div>
                )}
                
                {profile.hourly_rate && (
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>R$ {profile.hourly_rate}/hora</span>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground">Jobs concluídos: </span>
                  <span className="font-semibold">{profile.total_jobs || 0}</span>
                </div>

                {profile.is_pro_member && (
                  <Badge variant="premium" className="w-fit">
                    Membro Pro
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specialtyLabels.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {profile.equipment && (
              <Card>
                <CardHeader>
                  <CardTitle>Equipamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{profile.equipment}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="space-y-2">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : item.video_url ? (
                          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground">Vídeo</span>
                          </div>
                        ) : item.audio_url ? (
                          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground">Áudio</span>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground">Mídia</span>
                          </div>
                        )}
                        <h4 className="font-semibold">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum item no portfólio ainda.
                  </p>
                )}
              </CardContent>
            </Card>

            <AvailabilityDisplay freelancerId={id!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPublicProfile;