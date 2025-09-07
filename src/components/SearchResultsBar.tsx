import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { SearchFilters as ISearchFilters } from '@/hooks/useFreelancerSearch';
import SearchFilters from '@/components/SearchFilters';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchResultsBarProps {
  filters: ISearchFilters;
  onFiltersChange: (filters: ISearchFilters) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
}

const SearchResultsBar = ({ 
  filters, 
  onFiltersChange, 
  sortBy, 
  onSortChange, 
  totalResults 
}: SearchResultsBarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof ISearchFilters];
    return value && (Array.isArray(value) ? value.length > 0 : true);
  }).length;

  const clearFilter = (filterKey: keyof ISearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="sticky top-[var(--header-height)] z-40 bg-background/95 backdrop-blur border-b py-3 safe-area-inset-top">
      <div className="container">
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[90vh]" : "w-96"}>
                <SheetHeader>
                  <SheetTitle>Filtros de Busca</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-4rem)] mt-4">
                  <SearchFilters
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                      onFiltersChange(newFilters);
                      if (isMobile) setFiltersOpen(false);
                    }}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Melhor Avaliado</SelectItem>
                <SelectItem value="price_asc">Menor Preço</SelectItem>
                <SelectItem value="price_desc">Maior Preço</SelectItem>
                <SelectItem value="experience">Mais Experiência</SelectItem>
                <SelectItem value="recent">Mais Recente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {filters.specialties?.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <button
                  onClick={() => {
                    const newSpecialties = filters.specialties?.filter(s => s !== specialty) || [];
                    onFiltersChange({
                      ...filters,
                      specialties: newSpecialties.length > 0 ? newSpecialties : undefined
                    });
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            
            {filters.city && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.city}
                <button
                  onClick={() => clearFilter('city')}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {filters.state && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.state}
                <button
                  onClick={() => clearFilter('state')}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                R$ {filters.minPrice || 0} - R$ {filters.maxPrice || 1000}
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters.minPrice;
                    delete newFilters.maxPrice;
                    onFiltersChange(newFilters);
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsBar;