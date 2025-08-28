import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SearchFilters as ISearchFilters } from '@/hooks/useFreelancerSearch';
import { SPECIALTIES } from '@/lib/freelancer';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFiltersChange: (filters: ISearchFilters) => void;
}

const BRAZILIAN_CITIES = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília', 
  'Fortaleza', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus',
  'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
  'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina'
];

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<ISearchFilters>(filters);
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0, 
    filters.maxPrice || 1000
  ]);

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000]);
  }, [filters]);

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const currentSpecialties = localFilters.specialties || [];
    const newSpecialties = checked 
      ? [...currentSpecialties, specialty]
      : currentSpecialties.filter(s => s !== specialty);
    
    setLocalFilters(prev => ({
      ...prev,
      specialties: newSpecialties
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    setLocalFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setLocalFilters(prev => ({
      ...prev,
      availableDate: date ? date.toISOString().split('T')[0] : undefined
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ISearchFilters = {};
    setLocalFilters(emptyFilters);
    setPriceRange([0, 1000]);
    onFiltersChange(emptyFilters);
  };

  const selectedDate = localFilters.availableDate ? new Date(localFilters.availableDate) : undefined;

  return (
    <div className="space-y-6 p-4">
      {/* Especialidades */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Especialidades</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {SPECIALTIES.map((specialty) => (
            <div key={specialty.value} className="flex items-center space-x-2">
              <Checkbox
                id={specialty.value}
                checked={localFilters.specialties?.includes(specialty.value) || false}
                onCheckedChange={(checked) => 
                  handleSpecialtyChange(specialty.value, checked as boolean)
                }
              />
              <Label
                htmlFor={specialty.value}
                className="text-sm font-normal cursor-pointer"
              >
                {specialty.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Localização */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Localização</Label>
        <div className="space-y-2">
          <Select 
            value={localFilters.city || ''} 
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, city: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar cidade" />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={localFilters.state || ''} 
            onValueChange={(value) => setLocalFilters(prev => ({ ...prev, state: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {BRAZILIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Faixa de Preço */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Faixa de Preço por Hora (R$ {priceRange[0]} - R$ {priceRange[1]})
        </Label>
        <Slider
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          max={1000}
          min={0}
          step={50}
          className="w-full"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={priceRange[0]}
            onChange={(e) => handlePriceRangeChange([Number(e.target.value), priceRange[1]])}
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Máx"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-24"
          />
        </div>
      </div>

      {/* Avaliação Mínima */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Avaliação Mínima</Label>
        <Select 
          value={localFilters.minRating?.toString() || ''} 
          onValueChange={(value) => setLocalFilters(prev => ({ 
            ...prev, 
            minRating: value ? Number(value) : undefined 
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Qualquer avaliação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4+ estrelas</SelectItem>
            <SelectItem value="4.5">4.5+ estrelas</SelectItem>
            <SelectItem value="5">5 estrelas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data de Disponibilidade */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Data de Disponibilidade</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: ptBR })
              ) : (
                <span>Selecionar data</span>
              )}
              {selectedDate && (
                <X 
                  className="ml-auto h-4 w-4 hover:text-destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateSelect(undefined);
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2 pt-4 border-t">
        <Button onClick={applyFilters} className="w-full">
          Aplicar Filtros
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;