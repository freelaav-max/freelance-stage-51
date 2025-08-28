-- Fix security warnings by setting search_path for RPC functions

-- Fix set_availability function
CREATE OR REPLACE FUNCTION public.set_availability(
  start_at timestamptz,
  end_at timestamptz,
  status public.availability_status,
  source public.availability_source DEFAULT 'manual',
  notes text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix get_my_availability function
CREATE OR REPLACE FUNCTION public.get_my_availability(
  from_at timestamptz,
  to_at timestamptz
) RETURNS SETOF public.availability
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT * FROM public.availability
  WHERE freelancer_id = auth.uid()
    AND period && tstzrange(from_at, to_at, '[)');
$function$;

-- Fix validate_availability_no_overlap function  
CREATE OR REPLACE FUNCTION public.validate_availability_no_overlap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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