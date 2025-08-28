import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import FreelancerCard from '@/components/FreelancerCard';
import { useFreelancerSearch, SearchFilters as ISearchFilters } from '@/hooks/useFreelancerSearch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { results, loading, error, pagination, search, loadMore, reset } = useFreelancerSearch();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ISearchFilters>({});

  // Extract filters from URL params
  useEffect(() => {
    const specialty = searchParams.get('specialty');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') as ISearchFilters['sortBy'];
    const searchTerm = searchParams.get('q');

    const filters: ISearchFilters = {
      specialties: specialty ? [specialty] : [],
      city: city || undefined,
      state: state || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy || 'relevance'
    };

    setCurrentFilters(filters);
    search(searchTerm || undefined, filters);
  }, [searchParams, search]);

  const handleFilterChange = (filters: ISearchFilters) => {
    setCurrentFilters(filters);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    
    if (filters.specialties?.length) {
      newParams.set('specialty', filters.specialties[0]);
    } else {
      newParams.delete('specialty');
    }
    
    if (filters.city) {
      newParams.set('city', filters.city);
    } else {
      newParams.delete('city');
    }
    
    if (filters.state) {
      newParams.set('state', filters.state);
    } else {
      newParams.delete('state');
    }
    
    if (filters.minPrice) {
      newParams.set('minPrice', filters.minPrice.toString());
    } else {
      newParams.delete('minPrice');
    }
    
    if (filters.maxPrice) {
      newParams.set('maxPrice', filters.maxPrice.toString());
    } else {
      newParams.delete('maxPrice');
    }
    
    if (filters.sortBy && filters.sortBy !== 'relevance') {
      newParams.set('sortBy', filters.sortBy);
    } else {
      newParams.delete('sortBy');
    }

    setSearchParams(newParams);
    setFiltersOpen(false);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...currentFilters, sortBy: sortBy as ISearchFilters['sortBy'] };
    handleFilterChange(newFilters);
  };

  const clearFilter = (filterKey: keyof ISearchFilters) => {
    const newFilters = { ...currentFilters };
    delete newFilters[filterKey];
    handleFilterChange(newFilters);
  };

  const activeFiltersCount = Object.values(currentFilters).filter(value => 
    value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const searchTerm = searchParams.get('q');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="space-y-6">
          {/* Search Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Buscar Freelancers'}
                </h1>
                <p className="text-muted-foreground">
                  {pagination.total} profissionais encontrados
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={currentFilters.sortBy || 'relevance'} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                    <SelectItem value="price_asc">Menor Preço</SelectItem>
                    <SelectItem value="price_desc">Maior Preço</SelectItem>
                  </SelectContent>
                </Select>
                
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filtros
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filtros de Busca</SheetTitle>
                    </SheetHeader>
                    <SearchFilters 
                      filters={currentFilters}
                      onFiltersChange={handleFilterChange}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentFilters.specialties?.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="cursor-pointer">
                    {specialty}
                    <button 
                      onClick={() => clearFilter('specialties')}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {currentFilters.city && (
                  <Badge variant="secondary" className="cursor-pointer">
                    {currentFilters.city}
                    <button 
                      onClick={() => clearFilter('city')}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(currentFilters.minPrice || currentFilters.maxPrice) && (
                  <Badge variant="secondary" className="cursor-pointer">
                    R$ {currentFilters.minPrice || 0} - R$ {currentFilters.maxPrice || '∞'}
                    <button 
                      onClick={() => {
                        clearFilter('minPrice');
                        clearFilter('maxPrice');
                      }}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Buscando profissionais...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <Button 
                onClick={() => search(searchTerm || undefined, currentFilters)}
                className="mt-4"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum freelancer encontrado com os filtros selecionados.</p>
              <Button 
                onClick={() => {
                  reset();
                  setSearchParams({});
                }}
                variant="outline"
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((freelancer) => (
                  <FreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>

              {/* Load More */}
              {pagination.hasMore && (
                <div className="text-center">
                  <Button 
                    onClick={() => loadMore(searchTerm || undefined, currentFilters)}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Carregando...
                      </>
                    ) : (
                      'Carregar Mais'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;