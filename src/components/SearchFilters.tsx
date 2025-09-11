import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SearchDatePicker } from '@/components/SearchDatePicker';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Filter, 
  ChevronDown, 
  X,
  Star 
} from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  filters?: SearchFilters;
  className?: string;
}

export interface SearchFilters {
  location?: {
    city?: string;
    state?: string;
    radius?: number;
  };
  specialties?: string[];
  availableDate?: string; // Changed from Date to string to match existing interface
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  experience?: number;
  equipment?: string[];
  availability?: 'available' | 'busy' | 'any';
}

const SPECIALTIES = [
  'Audiovisual',
  'Vídeo',
  'Áudio',
  'Fotografia',
  'Iluminação',
  'Streaming',
  'Edição',
  'Motion Graphics'
];

const EQUIPMENT_OPTIONS = [
  'Câmeras Profissionais',
  'Drones',
  'Iluminação LED',
  'Microfones Lapela',
  'Equipamentos de Som',
  'Teleprompter',
  'Steadicam',
  'Lentes Prime'
];

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onFiltersChange, 
  className = '' 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    experience: 0,
    availability: 'any'
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const addActiveFilter = (filterName: string) => {
    if (!activeFilters.includes(filterName)) {
      setActiveFilters([...activeFilters, filterName]);
    }
  };

  const removeActiveFilter = (filterName: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filterName));
    
    // Reset the corresponding filter
    switch (filterName) {
      case 'location':
        updateFilters({ location: undefined });
        break;
      case 'specialties':
        updateFilters({ specialties: [] });
        break;
      case 'date':
        updateFilters({ availableDate: undefined });
        break;
      case 'price':
        updateFilters({ priceRange: { min: 0, max: 10000 } });
        break;
      case 'rating':
        updateFilters({ rating: 0 });
        break;
      case 'experience':
        updateFilters({ experience: 0 });
        break;
      case 'equipment':
        updateFilters({ equipment: [] });
        break;
    }
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      experience: 0,
      availability: 'any'
    };
    setFilters(clearedFilters);
    setActiveFilters([]);
    onFiltersChange(clearedFilters);
  };

  const handleLocationChange = (field: 'city' | 'state' | 'radius', value: string | number) => {
    const newLocation = { ...filters.location, [field]: value };
    updateFilters({ location: newLocation });
    addActiveFilter('location');
  };

  const handleSpecialtyToggle = (specialty: string, checked: boolean) => {
    const currentSpecialties = filters.specialties || [];
    const newSpecialties = checked 
      ? [...currentSpecialties, specialty]
      : currentSpecialties.filter(s => s !== specialty);
    
    updateFilters({ specialties: newSpecialties });
    if (newSpecialties.length > 0) {
      addActiveFilter('specialties');
    } else {
      removeActiveFilter('specialties');
    }
  };

  const handleEquipmentToggle = (equipment: string, checked: boolean) => {
    const currentEquipment = filters.equipment || [];
    const newEquipment = checked 
      ? [...currentEquipment, equipment]
      : currentEquipment.filter(e => e !== equipment);
    
    updateFilters({ equipment: newEquipment });
    if (newEquipment.length > 0) {
      addActiveFilter('equipment');
    } else {
      removeActiveFilter('equipment');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeActiveFilter(filter)}
                />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Limpar Todos
            </Button>
          </div>
        )}
      </CardHeader>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            
            {/* Location Filters */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4" />
                Localização
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Cidade"
                  value={filters.location?.city || ''}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                />
                
                <Select
                  value={filters.location?.state || ''}
                  onValueChange={(value) => handleLocationChange('state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAZILIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="space-y-2">
                  <Label className="text-sm">Raio: {filters.location?.radius || 0} km</Label>
                  <Slider
                    value={[filters.location?.radius || 0]}
                    onValueChange={([value]) => handleLocationChange('radius', value)}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-3">
              <Label className="font-medium">Especialidades</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SPECIALTIES.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={filters.specialties?.includes(specialty) || false}
                      onCheckedChange={(checked) => 
                        handleSpecialtyToggle(specialty, checked as boolean)
                      }
                    />
                    <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Availability */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4" />
                Disponível em
              </Label>
              <SearchDatePicker
                date={filters.availableDate ? new Date(filters.availableDate) : undefined}
                onDateChange={(date) => {
                  updateFilters({ availableDate: date?.toISOString().split('T')[0] });
                  if (date) addActiveFilter('date');
                  else removeActiveFilter('date');
                }}
                placeholder="Selecionar data"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium">
                <DollarSign className="h-4 w-4" />
                Faixa de Preço (R$ {filters.priceRange?.min} - R$ {filters.priceRange?.max})
              </Label>
              <Slider
                value={[filters.priceRange?.min || 0, filters.priceRange?.max || 10000]}
                onValueChange={([min, max]) => {
                  updateFilters({ priceRange: { min, max } });
                  addActiveFilter('price');
                }}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium">
                <Star className="h-4 w-4" />
                Avaliação Mínima
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      updateFilters({ rating });
                      if (rating > 0) addActiveFilter('rating');
                      else removeActiveFilter('rating');
                    }}
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <Label className="font-medium">
                Experiência Mínima: {filters.experience} anos
              </Label>
              <Slider
                value={[filters.experience || 0]}
                onValueChange={([value]) => {
                  updateFilters({ experience: value });
                  if (value > 0) addActiveFilter('experience');
                  else removeActiveFilter('experience');
                }}
                max={20}
                step={1}
                className="w-full"
              />
            </div>

            {/* Equipment */}
            <div className="space-y-3">
              <Label className="font-medium">Equipamentos</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EQUIPMENT_OPTIONS.map(equipment => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={equipment}
                      checked={filters.equipment?.includes(equipment) || false}
                      onCheckedChange={(checked) => 
                        handleEquipmentToggle(equipment, checked as boolean)
                      }
                    />
                    <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SearchFilters;