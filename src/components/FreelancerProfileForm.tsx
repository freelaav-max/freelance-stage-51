import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateFreelancerProfile, updateFreelancerSpecialties, uploadAvatar, uploadPortfolioImage, calculateProfileStrength, SPECIALTIES } from '@/lib/freelancer';
import { useToast } from '@/hooks/use-toast';
import { useFreelancerProfile } from '@/hooks/useFreelancerProfile';
import { FreelancerCalendar } from '@/components/FreelancerCalendar';

const freelancerSchema = z.object({
  bio: z.string().optional(),
  experience_years: z.number().min(0).max(50).optional(),
  hourly_rate: z.number().min(0).optional(),
  equipment: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

type FreelancerFormData = z.infer<typeof freelancerSchema>;

export const FreelancerProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, specialties, portfolioItems, loading, refetch } = useFreelancerProfile();
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(specialties);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const form = useForm<FreelancerFormData>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      bio: profile?.bio || '',
      experience_years: profile?.experience_years || undefined,
      hourly_rate: profile?.hourly_rate ? Number(profile.hourly_rate) : undefined,
      equipment: profile?.equipment || '',
      city: profile?.profiles?.city || profile?.city || '',
      state: profile?.profiles?.state || profile?.state || '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        bio: profile.bio || '',
        experience_years: profile.experience_years || undefined,
        hourly_rate: profile.hourly_rate ? Number(profile.hourly_rate) : undefined,
        equipment: profile.equipment || '',
        city: profile.profiles?.city || profile.city || '',
        state: profile.profiles?.state || profile.state || '',
      });
      setSelectedSpecialties(specialties);
    }
  }, [profile, specialties, form]);

  const onSubmit = async (data: FreelancerFormData) => {
    if (!user?.id) return;

    try {
      setUploading(true);
      
      await updateFreelancerProfile(user.id, {
        ...data,
        hourly_rate: data.hourly_rate || null,
      });

      await updateFreelancerSpecialties(user.id, selectedSpecialties);

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setUploading(true);
      const url = await uploadAvatar(user.id, file);
      setAvatarUrl(url);
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const profileStrength = profile ? calculateProfileStrength(profile, selectedSpecialties, portfolioItems.length) : 0;

  if (loading) {
    return <div className="text-center p-8">Carregando perfil...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Força do Perfil</CardTitle>
          <CardDescription>Complete seu perfil para atrair mais clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{profileStrength}%</span>
            </div>
            <Progress value={profileStrength} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>Adicione uma foto profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback>
                <Camera className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Enviando...' : 'Alterar Foto'}
                  </span>
                </Button>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
          <CardDescription>Selecione suas áreas de atuação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SPECIALTIES.map((specialty) => (
              <Badge
                key={specialty.value}
                variant={selectedSpecialties.includes(specialty.value) ? "default" : "outline"}
                className="cursor-pointer justify-center p-2"
                onClick={() => toggleSpecialty(specialty.value)}
              >
                {specialty.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Profissionais</CardTitle>
          <CardDescription>Complete seus dados profissionais</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conte um pouco sobre sua experiência e estilo de trabalho..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experience_years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anos de Experiência</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourly_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor por Hora (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="150"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipamentos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste seus principais equipamentos e marcas..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? 'Salvando...' : 'Salvar Perfil'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agenda e Disponibilidade</CardTitle>
          <CardDescription>Gerencie sua disponibilidade para receber ofertas de trabalho</CardDescription>
        </CardHeader>
        <CardContent>
          <FreelancerCalendar />
        </CardContent>
      </Card>
    </div>
  );
};