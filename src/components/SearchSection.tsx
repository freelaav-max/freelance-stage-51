
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Search } from "lucide-react";
import { SearchDatePicker } from "@/components/SearchDatePicker";
import { supabase } from "@/integrations/supabase/client";
import { getSpecialtyLabel } from "@/lib/specialty-translations";
import { Skeleton } from "@/components/ui/skeleton";

interface Specialty {
  value: string;
  label: string;
}

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [availableDate, setAvailableDate] = useState<Date | undefined>();
  const [priceRange, setPriceRange] = useState("");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [specialtyError, setSpecialtyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const { data, error } = await supabase
          .from('freelancer_specialties')
          .select('specialty');
        
        if (error) throw error;
        
        // Deduplicate and transform to label format
        const uniqueSpecialties = Array.from(new Set(data.map(item => item.specialty)))
          .map(value => ({
            value,
            label: getSpecialtyLabel(value as any)
          }));
        
        setSpecialties(uniqueSpecialties);
      } catch (error) {
        setSpecialtyError('Erro ao carregar especialidades');
        console.error('Error fetching specialties:', error);
      } finally {
        setLoadingSpecialties(false);
      }
    };

    fetchSpecialties();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (specialty) params.set('specialty', specialty);
    if (city) params.set('city', city);
    if (availableDate) params.set('date', availableDate.toISOString().split('T')[0]);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max && max !== '+') params.set('maxPrice', max);
    }
    
    navigate(`/search?${params.toString()}`);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-16 -mt-10 relative z-20">
      <div className="container">
        <div className="search-container max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">
            Encontre o Profissional Ideal para seu Projeto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Busca Geral */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </label>
              <Input
                placeholder="Ex: cinegrafista experiente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Especialidade
              </label>
              {loadingSpecialties ? (
                <Skeleton className="h-10 w-full" />
              ) : specialtyError ? (
                <div className="h-10 flex items-center px-3 border rounded-md text-sm text-muted-foreground">
                  {specialtyError}
                </div>
              ) : (
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((spec) => (
                      <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localização
              </label>
              <Input
                placeholder="Ex: São Paulo, SP"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data
              </label>
              <SearchDatePicker
                date={availableDate}
                onDateChange={setAvailableDate}
                placeholder="Selecionar data"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Orçamento
              </label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">Até R$ 500</SelectItem>
                  <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                  <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
                  <SelectItem value="2000-5000">R$ 2.000 - R$ 5.000</SelectItem>
                  <SelectItem value="5000+">Acima R$ 5.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              onClick={handleSearch}
              variant="premium"
              className="w-full sm:w-auto px-8"
              size="lg"
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar Profissionais
            </Button>
            <Button 
              variant="hero" 
              className="w-full sm:w-auto"
              onClick={() => navigate('/search')}
            >
              Busca Avançada
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
