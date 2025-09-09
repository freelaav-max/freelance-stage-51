import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialtyLabel } from "@/lib/specialty-translations";
import { Camera, Headphones, Lightbulb, Video, Radio, Monitor, Plane } from "lucide-react";

interface Specialty {
  value: string;
  label: string;
  icon: any;
}

const getSpecialtyIcon = (specialty: string) => {
  const iconMap: Record<string, any> = {
    audio_engineer: Headphones,
    camera_operator: Camera,
    lighting_technician: Lightbulb,
    video_editor: Video,
    live_streaming: Radio,
    post_production: Monitor,
    drone_operator: Plane,
  };
  return iconMap[specialty] || Camera;
};

const FeaturedSpecialtiesSection = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const { data, error } = await supabase
          .from('freelancer_specialties')
          .select('specialty');
        
        if (error) throw error;
        
        // Deduplicate and transform to specialty objects
        const uniqueSpecialties = Array.from(new Set(data.map(item => item.specialty)))
          .map(value => ({
            value,
            label: getSpecialtyLabel(value as any),
            icon: getSpecialtyIcon(value)
          }))
          .slice(0, 6); // Show only top 6 specialties
        
        setSpecialties(uniqueSpecialties);
      } catch (error) {
        setError('Erro ao carregar especialidades');
        console.error('Error fetching specialties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  const handleSpecialtyClick = (specialty: Specialty) => {
    navigate(`/search?specialty=${specialty.value}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (specialties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Especialidades</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Encontre o profissional ideal para seu projeto audiovisual
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => {
            const IconComponent = specialty.icon;
            return (
              <Button
                key={specialty.value}
                variant="ghost"
                className="h-auto p-6 flex flex-col items-center gap-4 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-200"
                onClick={() => handleSpecialtyClick(specialty)}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">{specialty.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Profissionais especializados
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpecialtiesSection;