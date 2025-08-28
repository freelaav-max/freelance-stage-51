import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  specialties?: string[];
  city?: string;
  state?: string;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableDate?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'proximity';
  page?: number;
  limit?: number;
}

export interface FreelancerSearchResult {
  id: string;
  bio: string;
  hourly_rate: number;
  experience_years: number;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  is_pro_member: boolean;
  specialties: string[];
  portfolio: Array<{
    id: string;
    title: string;
    media_url: string;
    thumbnail_url?: string;
    media_type: string;
  }>;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    city?: string;
    state?: string;
  };
}

export interface SearchResponse {
  results: FreelancerSearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const useFreelancerSearch = () => {
  const [results, setResults] = useState<FreelancerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasMore: false
  });

  const search = useCallback(async (searchTerm?: string, filters: SearchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('search-freelancers', {
        body: { searchTerm, filters }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setResults(data.results);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar freelancers';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (searchTerm?: string, filters: SearchFilters = {}) => {
    if (!pagination.hasMore || loading) return;

    setLoading(true);

    try {
      const nextPage = pagination.page + 1;
      const { data, error: functionError } = await supabase.functions.invoke('search-freelancers', {
        body: { 
          searchTerm, 
          filters: { ...filters, page: nextPage } 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setResults(prev => [...prev, ...data.results]);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mais resultados';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination, loading]);

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setPagination({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
      hasMore: false
    });
  }, []);

  return {
    results,
    loading,
    error,
    pagination,
    search,
    loadMore,
    reset
  };
};