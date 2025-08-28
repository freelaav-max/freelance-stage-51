-- FASE 4: Agenda e Disponibilidade - Backend (Supabase)

-- 1) Tipos ENUM
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN 
    CREATE TYPE public.availability_status AS ENUM ('available','unavailable','partial'); 
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_source') THEN 
    CREATE TYPE public.availability_source AS ENUM ('manual','google','ical','auto_blocked','other'); 
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN 
    CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','cancelled'); 
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'calendar_provider') THEN 
    CREATE TYPE public.calendar_provider AS ENUM ('google','ical','outlook','other'); 
  END IF; 
END$$;

-- 2) Tabela availability
CREATE TABLE IF NOT EXISTS public.availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL,
  period tstzrange NOT NULL,
  status public.availability_status NOT NULL,
  source public.availability_source NOT NULL DEFAULT 'manual',
  notes text,
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT availability_period_not_empty CHECK (NOT isempty(period)),
  CONSTRAINT availability_period_finite CHECK (NOT lower_inf(period) AND NOT upper_inf(period))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_availability_freelancer ON public.availability (freelancer_id);
CREATE INDEX IF NOT EXISTS idx_availability_period_gist ON public.availability USING gist (period);

-- RLS
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Freelancers can manage own availability" ON public.availability;
CREATE POLICY "Freelancers can manage own availability" ON public.availability 
  FOR ALL 
  USING (auth.uid() = freelancer_id) 
  WITH CHECK (auth.uid() = freelancer_id);

-- Trigger updated_at
DROP TRIGGER IF EXISTS availability_set_updated_at ON public.availability;
CREATE TRIGGER availability_set_updated_at 
  BEFORE UPDATE ON public.availability 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Validação de conflitos (sem sobreposição por freelancer)
CREATE OR REPLACE FUNCTION public.validate_availability_no_overlap()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Evita sobreposição de períodos para o mesmo freelancer
  IF EXISTS (
    SELECT 1 FROM public.availability a
    WHERE a.freelancer_id = NEW.freelancer_id
      AND (NEW.id IS NULL OR a.id <> NEW.id)
      AND a.period && NEW.period
  ) THEN
    RAISE EXCEPTION 'Availability overlaps an existing entry for this freelancer';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS availability_no_overlap ON public.availability;
CREATE TRIGGER availability_no_overlap 
  BEFORE INSERT OR UPDATE ON public.availability 
  FOR EACH ROW EXECUTE FUNCTION public.validate_availability_no_overlap();

-- 3) Tabela bookings (reservas) com bloqueio automático
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL,
  client_id uuid,
  period tstzrange NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  title text,
  notes text,
  source text DEFAULT 'app',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_period_not_empty CHECK (NOT isempty(period)),
  CONSTRAINT bookings_period_finite CHECK (NOT lower_inf(period) AND NOT upper_inf(period))
);

CREATE INDEX IF NOT EXISTS idx_bookings_freelancer ON public.bookings (freelancer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings (client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_period_gist ON public.bookings USING gist (period);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Freelancers can manage own bookings" ON public.bookings;
CREATE POLICY "Freelancers can manage own bookings" ON public.bookings 
  FOR ALL 
  USING (auth.uid() = freelancer_id) 
  WITH CHECK (auth.uid() = freelancer_id);

DROP POLICY IF EXISTS "Clients can view own bookings" ON public.bookings;
CREATE POLICY "Clients can view own bookings" ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = client_id);

-- Trigger updated_at para bookings
DROP TRIGGER IF EXISTS bookings_set_updated_at ON public.bookings;
CREATE TRIGGER bookings_set_updated_at 
  BEFORE UPDATE ON public.bookings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para bloquear/desbloquear disponibilidade automaticamente com base em bookings
CREATE OR REPLACE FUNCTION public.handle_booking_blocking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  booking_range tstzrange;
BEGIN
  booking_range := NEW.period;

  -- Em atualizações, se mudou de confirmado para cancelado/pending, remove o bloqueio
  IF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status <> 'confirmed' THEN
    DELETE FROM public.availability
    WHERE freelancer_id = NEW.freelancer_id
      AND source = 'auto_blocked'
      AND external_id = NEW.id::text;
    RETURN NEW;
  END IF;

  -- Em inserts ou updates para confirmado, cria/atualiza o bloqueio
  IF NEW.status = 'confirmed' THEN
    -- Remove qualquer disponibilidade que conflite no intervalo (para garantir inserção limpa)
    DELETE FROM public.availability
    WHERE freelancer_id = NEW.freelancer_id
      AND period && booking_range;

    -- Se já existir bloqueio deste booking, atualiza; senão, cria
    IF EXISTS (
      SELECT 1 FROM public.availability
      WHERE freelancer_id = NEW.freelancer_id
        AND source = 'auto_blocked'
        AND external_id = NEW.id::text
    ) THEN
      UPDATE public.availability
      SET period = booking_range,
          status = 'unavailable',
          source = 'auto_blocked'
      WHERE freelancer_id = NEW.freelancer_id
        AND source = 'auto_blocked'
        AND external_id = NEW.id::text;
    ELSE
      INSERT INTO public.availability (freelancer_id, period, status, source, external_id, notes)
      VALUES (NEW.freelancer_id, booking_range, 'unavailable', 'auto_blocked', NEW.id::text, 'Blocked by booking');
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS bookings_auto_block ON public.bookings;
CREATE TRIGGER bookings_auto_block 
  AFTER INSERT OR UPDATE ON public.bookings 
  FOR EACH ROW EXECUTE FUNCTION public.handle_booking_blocking();

-- 4) Conexões com calendários externos (metadados e ICS)
CREATE TABLE IF NOT EXISTS public.calendar_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL,
  provider public.calendar_provider NOT NULL,
  ical_url text,
  external_calendar_id text,
  is_active boolean NOT NULL DEFAULT true,
  last_sync_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_connections_freelancer ON public.calendar_connections (freelancer_id);

ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Freelancers can manage own calendar connections" ON public.calendar_connections;
CREATE POLICY "Freelancers can manage own calendar connections" ON public.calendar_connections 
  FOR ALL 
  USING (auth.uid() = freelancer_id) 
  WITH CHECK (auth.uid() = freelancer_id);

DROP TRIGGER IF EXISTS calendar_connections_set_updated_at ON public.calendar_connections;
CREATE TRIGGER calendar_connections_set_updated_at 
  BEFORE UPDATE ON public.calendar_connections 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Funções RPC para CRUD/consulta de disponibilidade

-- Cria uma janela de disponibilidade para o usuário autenticado
CREATE OR REPLACE FUNCTION public.set_availability(
  start_at timestamptz,
  end_at timestamptz,
  status public.availability_status,
  source public.availability_source DEFAULT 'manual',
  notes text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_id uuid;
BEGIN
  IF start_at >= end_at THEN
    RAISE EXCEPTION 'start_at must be before end_at';
  END IF;

  INSERT INTO public.availability (freelancer_id, period, status, source, notes)
  VALUES (auth.uid(), tstzrange(start_at, end_at, '[)'), status, source, notes)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$function$;

-- Lista a disponibilidade do próprio usuário em um intervalo
CREATE OR REPLACE FUNCTION public.get_my_availability(
  from_at timestamptz,
  to_at timestamptz
) RETURNS SETOF public.availability
LANGUAGE sql
AS $function$
  SELECT * FROM public.availability
  WHERE freelancer_id = auth.uid()
    AND period && tstzrange(from_at, to_at, '[)');
$function$;

-- Disponibilidade pública (somente períodos ocupados/ parciais), para exibir no perfil público
CREATE OR REPLACE FUNCTION public.get_public_availability(
  freelancer uuid,
  from_at timestamptz,
  to_at timestamptz
) RETURNS TABLE (
  period tstzrange,
  status public.availability_status
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT a.period, a.status
  FROM public.availability a
  WHERE a.freelancer_id = freelancer
    AND a.period && tstzrange(from_at, to_at, '[)')
    AND a.status IN ('unavailable','partial')
    AND EXISTS (
      SELECT 1 FROM public.freelancer_profiles fp
      WHERE fp.id = a.freelancer_id
    );
$function$;