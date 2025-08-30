
-- Garantir que o enum de especialidades existe com os valores corretos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'specialty') THEN
        CREATE TYPE specialty AS ENUM (
            'audio_engineer',
            'camera_operator', 
            'lighting_technician',
            'video_editor',
            'live_streaming',
            'post_production',
            'drone_operator'
        );
    END IF;
END $$;

-- Garantir que o enum de user_type existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('freelancer', 'client');
    END IF;
END $$;

-- Garantir que o enum de offer_status existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'counter_proposed');
    END IF;
END $$;

-- Script de seeding idempotente para dados de demonstração
DO $$ 
DECLARE
    mariana_user_id uuid;
    carlos_user_id uuid;
    offer_id uuid;
BEGIN
    -- IDs fixos para manter consistência
    mariana_user_id := '550e8400-e29b-41d4-a716-446655440001'::uuid;
    carlos_user_id := '550e8400-e29b-41d4-a716-446655440002'::uuid;

    -- 1. Criar usuário Mariana (Cliente) se não existir
    INSERT INTO auth.users (
        id, 
        email, 
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        aud,
        role
    ) VALUES (
        mariana_user_id,
        'mariana.cliente@freelaav.com',
        crypt('demo123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"full_name": "Mariana Oliveira", "user_type": "client"}'::jsonb,
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Criar usuário Carlos (Freelancer) se não existir  
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password, 
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        aud,
        role
    ) VALUES (
        carlos_user_id,
        'carlos.freela@freelaav.com',
        crypt('demo123', gen_salt('bf')),
        now(),
        now(), 
        now(),
        '{"full_name": "Carlos Silva", "user_type": "freelancer"}'::jsonb,
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. Criar perfil da Mariana
    INSERT INTO profiles (
        id,
        user_type,
        full_name,
        email,
        city,
        state,
        country,
        created_at,
        updated_at
    ) VALUES (
        mariana_user_id,
        'client',
        'Mariana Oliveira',
        'mariana.cliente@freelaav.com',
        'São Paulo',
        'SP',
        'Brazil',
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- 4. Criar perfil do Carlos
    INSERT INTO profiles (
        id,
        user_type,
        full_name,
        email,
        city,
        state,
        country,
        created_at,
        updated_at
    ) VALUES (
        carlos_user_id,
        'freelancer',
        'Carlos Silva',
        'carlos.freela@freelaav.com',
        'São Paulo',
        'SP',
        'Brazil',
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- 5. Criar perfil freelancer do Carlos
    INSERT INTO freelancer_profiles (
        id,
        bio,
        hourly_rate,
        experience_years,
        rating,
        total_reviews,
        total_jobs,
        is_pro_member,
        created_at,
        updated_at
    ) VALUES (
        carlos_user_id,
        'Técnico de som com 10+ anos de experiência em eventos corporativos, shows e festivais. Especialista em mesas digitais Yamaha e Midas.',
        150.00,
        10,
        4.8,
        23,
        45,
        false,
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- 6. Associar especialidades ao Carlos
    INSERT INTO freelancer_specialties (freelancer_id, specialty) VALUES 
        (carlos_user_id, 'audio_engineer'),
        (carlos_user_id, 'lighting_technician')
    ON CONFLICT (freelancer_id, specialty) DO NOTHING;

    -- 7. Criar items do portfólio do Carlos
    INSERT INTO portfolio_items (
        freelancer_id,
        title,
        description,
        image_url,
        display_order,
        created_at
    ) VALUES 
        (
            carlos_user_id,
            'Festival de Verão 2024',
            'Sonorização principal de festival com público de 5000 pessoas',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
            1,
            now()
        ),
        (
            carlos_user_id,
            'Evento Corporativo TechStart',
            'Setup completo para conferência de tecnologia no WTC',
            'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
            2,
            now()
        ),
        (
            carlos_user_id,
            'Casamento Premium Itaipava',
            'Cerimônia e festa com sonorização premium e iluminação ambiente',
            'https://images.unsplash.com/photo-1519167758481-83f29c08391c?w=800',
            3,
            now()
        )
    ON CONFLICT DO NOTHING;

    -- 8. Criar a oferta de trabalho
    INSERT INTO offers (
        id,
        client_id,
        freelancer_id,
        specialty,
        title,
        description,
        event_date,
        event_time,
        location,
        budget,
        status,
        created_at,
        updated_at
    ) VALUES (
        '550e8400-e29b-41d4-a716-446655440003'::uuid,
        mariana_user_id,
        carlos_user_id,
        'audio_engineer',
        'Evento Corporativo Anual TechCorp',
        'Sonorização completa para auditório com 200 pessoas. Inclui 2 microfones de lapela, 2 de mão e som ambiente para coffee break.',
        '2025-10-30 09:00:00'::timestamp with time zone,
        '09:00 - 18:00',
        'Expo Center Norte - São Paulo, SP',
        1200.00,
        'pending',
        now(),
        now()
    ) ON CONFLICT (id) DO NOTHING;

    -- Armazenar o ID da oferta para usar nas mensagens
    offer_id := '550e8400-e29b-41d4-a716-446655440003'::uuid;

    -- 9. Criar mensagens do chat
    INSERT INTO messages (
        offer_id,
        sender_id,
        receiver_id,
        content,
        sent_at,
        read_at
    ) VALUES 
        (
            offer_id,
            carlos_user_id,
            mariana_user_id,
            'Olá, Mariana! Obrigado pelo interesse. O Rider técnico está completo ou precisarei levar equipamento extra?',
            now() - interval '2 hours',
            now() - interval '1 hour 45 minutes'
        ),
        (
            offer_id,
            mariana_user_id,
            carlos_user_id,
            'Oi, Carlos! O Rider é esse mesmo. Apenas o básico para palestras. Acha que atende?',
            now() - interval '1 hour 30 minutes',
            now() - interval '1 hour 15 minutes'
        ),
        (
            offer_id,
            carlos_user_id,
            mariana_user_id,
            'Perfeito, atende sim. Tenho tudo o que é necessário. Pode confirmar a oferta!',
            now() - interval '1 hour',
            now() - interval '45 minutes'
        )
    ON CONFLICT DO NOTHING;

END $$;
