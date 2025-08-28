
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, DollarSign, Search } from "lucide-react";
import { SPECIALTIES } from "@/lib/freelancer";

const BRAZILIAN_CITIES = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília', 
  'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus'
];

const POPULAR_SEARCHES = [
  { label: 'Casamentos', specialty: 'cinegrafista' },
  { label: 'Eventos Corporativos', specialty: 'tecnico-som' },
  { label: 'Shows', specialty: 'iluminador' },
  { label: 'Streaming', specialty: 'operador-camera' }
];

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('q', searchTerm);
    if (specialty) params.set('specialty', specialty);
    if (city) params.set('city', city);
    if (availableDate) params.set('date', availableDate);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max && max !== '+') params.set('maxPrice', max);
    }
    
    navigate(`/search?${params.toString()}`);
  };

  const handlePopularSearch = (popularSearch: typeof POPULAR_SEARCHES[0]) => {
    const params = new URLSearchParams();
    params.set('specialty', popularSearch.specialty);
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
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar área" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localização
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_CITIES.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>{cityName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data
              </label>
              <Input
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
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
              className="btn-gradient w-full sm:w-auto px-8"
              size="lg"
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar Profissionais
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => navigate('/search')}
            >
              Busca Avançada
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground mr-2">Popular:</span>
            {POPULAR_SEARCHES.map((search) => (
              <Badge 
                key={search.label}
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handlePopularSearch(search)}
              >
                {search.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
