
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { searchTerm, filters = {} } = await req.json()
    const { 
      specialties = [], 
      city, 
      state, 
      page = 1, 
      limit = 12,
      minPrice,
      maxPrice,
      minRating = 0
    } = filters

    console.log('Search request:', { searchTerm, filters })

    // Base query for freelancers
    let query = supabase
      .from('freelancer_profiles')
      .select(`
        *,
        profiles!inner(
          id,
          full_name,
          email,
          city,
          state,
          avatar_url,
          user_type
        ),
        freelancer_specialties(specialty),
        portfolio_items(
          id,
          title,
          image_url,
          video_url,
          audio_url,
          description
        )
      `, { count: 'exact' })
      .eq('profiles.user_type', 'freelancer')

    // Apply specialty filter if provided
    if (specialties.length > 0) {
      const { data: freelancersWithSpecialties } = await supabase
        .from('freelancer_specialties')
        .select('freelancer_id')
        .in('specialty', specialties)
      
      if (freelancersWithSpecialties) {
        const freelancerIds = freelancersWithSpecialties.map(fs => fs.freelancer_id)
        query = query.in('id', freelancerIds)
      }
    }

    // Apply rating filter
    if (minRating > 0) {
      query = query.gte('rating', minRating)
    }

    // Apply price filters
    if (minPrice) {
      query = query.gte('hourly_rate', minPrice)
    }
    if (maxPrice) {
      query = query.lte('hourly_rate', maxPrice)
    }

    // Execute query with pagination
    const offset = (page - 1) * limit
    const { data: freelancers, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching freelancers:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to search freelancers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process results and apply city/state filters
    let processedResults = (freelancers || []).map((freelancer: any) => ({
      id: freelancer.id,
      bio: freelancer.bio || '',
      hourly_rate: freelancer.hourly_rate || 0,
      experience_years: freelancer.experience_years || 0,
      rating: freelancer.rating || 0,
      total_reviews: freelancer.total_reviews || 0,
      total_jobs: freelancer.total_jobs || 0,
      is_pro_member: freelancer.is_pro_member || false,
      specialties: freelancer.freelancer_specialties?.map((fs: any) => fs.specialty) || [],
      portfolio: freelancer.portfolio_items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        media_url: item.image_url || item.video_url || item.audio_url,
        thumbnail_url: item.image_url,
        media_type: item.image_url ? 'image' : item.video_url ? 'video' : 'audio'
      })) || [],
      user: {
        id: freelancer.profiles.id,
        full_name: freelancer.profiles.full_name,
        email: freelancer.profiles.email,
        avatar_url: freelancer.profiles.avatar_url,
        city: freelancer.profiles.city,
        state: freelancer.profiles.state
      }
    }))

    // Apply city/state filters in post-processing
    if (city) {
      processedResults = processedResults.filter(freelancer => 
        freelancer.user.city?.toLowerCase().includes(city.toLowerCase())
      )
    }

    if (state) {
      processedResults = processedResults.filter(freelancer => 
        freelancer.user.state?.toLowerCase().includes(state.toLowerCase())
      )
    }

    // Apply search term filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      processedResults = processedResults.filter(freelancer =>
        freelancer.user.full_name.toLowerCase().includes(term) ||
        freelancer.bio.toLowerCase().includes(term) ||
        freelancer.specialties.some((spec: string) => spec.toLowerCase().includes(term))
      )
    }

    // Calculate pagination after filtering
    const total = processedResults.length
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    // Apply final pagination to processed results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = processedResults.slice(startIndex, endIndex)

    const response = {
      results: paginatedResults,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    }

    console.log(`Found ${total} freelancers, returning ${paginatedResults.length} for page ${page}`)

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in search-freelancers:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
