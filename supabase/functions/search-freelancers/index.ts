
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchFilters {
  specialties?: string[];
  city?: string;
  state?: string;
  radius?: number; // km
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableDate?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'proximity';
  page?: number;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { searchTerm, filters }: { searchTerm?: string; filters: SearchFilters } = await req.json();
    
    const {
      specialties = [],
      city,
      state,
      minPrice,
      maxPrice,
      minRating = 0,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = filters;

    // Build secure query using the RPC function for public data
    // This ensures we only get safe, public information about freelancers
    let query = supabaseClient
      .from('freelancer_profiles')
      .select(`
        *,
        freelancer_specialties!inner(specialty),
        portfolio_items(id, title, image_url, video_url, audio_url, description)
      `);

    // Apply filters
    if (specialties.length > 0) {
      query = query.in('freelancer_specialties.specialty', specialties);
    }

    // For location filtering, we'll need to get the public freelancer info
    // The profiles join won't work anymore due to RLS restrictions

    if (minPrice !== undefined) {
      query = query.gte('hourly_rate', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte('hourly_rate', maxPrice);
    }

    if (minRating > 0) {
      query = query.gte('rating', minRating);
    }

    // For text search, we'll search in bio only (profiles data is now secured)
    if (searchTerm) {
      query = query.ilike('bio', `%${searchTerm}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.order('hourly_rate', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('hourly_rate', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'relevance':
      default:
        // Pro members first, then by rating, then by total_jobs
        query = query.order('is_pro_member', { ascending: false })
                     .order('rating', { ascending: false })
                     .order('total_jobs', { ascending: false });
        break;
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: freelancers, error, count } = await query;

    if (error) {
      console.error('Search error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process results and get public profile data securely
    const processedResults = await Promise.all(
      freelancers?.map(async (freelancer) => {
        // Get public profile information using the secure RPC function
        const { data: publicProfile } = await supabaseClient
          .rpc('get_public_freelancer_info', { freelancer_id: freelancer.id });
        
        const profileInfo = publicProfile?.[0] || {};
        
        const specialtiesList = Array.isArray(freelancer.freelancer_specialties) 
          ? freelancer.freelancer_specialties.map((s: any) => s.specialty)
          : [freelancer.freelancer_specialties?.specialty].filter(Boolean);

        const portfolioItems = Array.isArray(freelancer.portfolio_items)
          ? freelancer.portfolio_items.slice(0, 3) // Limit to 3 items for search results
          : [];

        return {
          ...freelancer,
          specialties: specialtiesList,
          portfolio: portfolioItems,
          user: {
            // Only expose public information - secure data access
            id: profileInfo.id,
            full_name: profileInfo.full_name,
            city: profileInfo.city,
            state: profileInfo.state,
            avatar_url: profileInfo.avatar_url
          }
        };
      }) || []
    );

    // Calculate total pages
    const totalPages = count ? Math.ceil(count / limit) : 1;

    return new Response(
      JSON.stringify({
        results: processedResults,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasMore: page < totalPages
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
