-- Create freelancer calendar events table
CREATE TABLE public.freelancer_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID NOT NULL,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('platform_booking', 'external_commitment', 'unavailable_period')),
  reference_id UUID,
  title VARCHAR(255),
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external receivables table
CREATE TABLE public.external_receivables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID NOT NULL,
  service_title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  service_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'overdue', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.freelancer_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_receivables ENABLE ROW LEVEL SECURITY;

-- RLS Policies for freelancer_calendar_events
CREATE POLICY "Users can view their own calendar events" 
ON public.freelancer_calendar_events 
FOR SELECT 
USING (auth.uid() = freelancer_id);

CREATE POLICY "Users can create their own calendar events" 
ON public.freelancer_calendar_events 
FOR INSERT 
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Users can update their own calendar events" 
ON public.freelancer_calendar_events 
FOR UPDATE 
USING (auth.uid() = freelancer_id)
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Users can delete their own calendar events" 
ON public.freelancer_calendar_events 
FOR DELETE 
USING (auth.uid() = freelancer_id);

-- RLS Policies for external_receivables
CREATE POLICY "Users can view their own external receivables" 
ON public.external_receivables 
FOR SELECT 
USING (auth.uid() = freelancer_id);

CREATE POLICY "Users can create their own external receivables" 
ON public.external_receivables 
FOR INSERT 
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Users can update their own external receivables" 
ON public.external_receivables 
FOR UPDATE 
USING (auth.uid() = freelancer_id)
WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Users can delete their own external receivables" 
ON public.external_receivables 
FOR DELETE 
USING (auth.uid() = freelancer_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_freelancer_calendar_events_updated_at
BEFORE UPDATE ON public.freelancer_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_receivables_updated_at
BEFORE UPDATE ON public.external_receivables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RPC function to get freelancer availability for a date range
CREATE OR REPLACE FUNCTION public.get_freelancer_availability(
  p_freelancer_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(
  id UUID,
  start_datetime TIMESTAMP WITH TIME ZONE,
  end_datetime TIMESTAMP WITH TIME ZONE,
  type VARCHAR,
  title VARCHAR,
  description TEXT,
  location TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the requesting user is the freelancer or has permission
  IF auth.uid() != p_freelancer_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    fce.id,
    fce.start_datetime,
    fce.end_datetime,
    fce.type,
    fce.title,
    fce.description,
    fce.location
  FROM freelancer_calendar_events fce
  WHERE fce.freelancer_id = p_freelancer_id
    AND DATE(fce.start_datetime) >= p_start_date
    AND DATE(fce.start_datetime) <= p_end_date
  ORDER BY fce.start_datetime;
END;
$$;

-- RPC function to get freelancer receivables summary
CREATE OR REPLACE FUNCTION public.get_freelancer_receivables_summary(
  p_freelancer_id UUID
)
RETURNS TABLE(
  total_pending DECIMAL,
  total_received DECIMAL,
  total_overdue DECIMAL,
  platform_pending DECIMAL,
  external_pending DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the requesting user is the freelancer
  IF auth.uid() != p_freelancer_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN er.status = 'pending' THEN er.amount ELSE 0 END), 0) as total_pending,
    COALESCE(SUM(CASE WHEN er.status = 'received' THEN er.amount ELSE 0 END), 0) as total_received,
    COALESCE(SUM(CASE WHEN er.status = 'overdue' THEN er.amount ELSE 0 END), 0) as total_overdue,
    0::DECIMAL as platform_pending, -- TODO: Add platform payments when implemented
    COALESCE(SUM(CASE WHEN er.status = 'pending' THEN er.amount ELSE 0 END), 0) as external_pending
  FROM external_receivables er
  WHERE er.freelancer_id = p_freelancer_id;
END;
$$;

-- RPC function to create calendar event
CREATE OR REPLACE FUNCTION public.create_calendar_event(
  p_start_datetime TIMESTAMP WITH TIME ZONE,
  p_end_datetime TIMESTAMP WITH TIME ZONE,
  p_type VARCHAR,
  p_title VARCHAR DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_event_id UUID;
BEGIN
  INSERT INTO freelancer_calendar_events (
    freelancer_id,
    start_datetime,
    end_datetime,
    type,
    title,
    description,
    location
  ) VALUES (
    auth.uid(),
    p_start_datetime,
    p_end_datetime,
    p_type,
    p_title,
    p_description,
    p_location
  ) RETURNING id INTO new_event_id;
  
  RETURN new_event_id;
END;
$$;

-- RPC function to create external receivable
CREATE OR REPLACE FUNCTION public.create_external_receivable(
  p_service_title VARCHAR,
  p_client_name VARCHAR,
  p_service_date DATE,
  p_amount DECIMAL,
  p_due_date DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_receivable_id UUID;
BEGIN
  INSERT INTO external_receivables (
    freelancer_id,
    service_title,
    client_name,
    service_date,
    amount,
    due_date,
    notes
  ) VALUES (
    auth.uid(),
    p_service_title,
    p_client_name,
    p_service_date,
    p_amount,
    p_due_date,
    p_notes
  ) RETURNING id INTO new_receivable_id;
  
  RETURN new_receivable_id;
END;
$$;

-- RPC function to update external receivable status
CREATE OR REPLACE FUNCTION public.update_external_receivable_status(
  p_receivable_id UUID,
  p_status VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE external_receivables 
  SET status = p_status
  WHERE id = p_receivable_id 
    AND freelancer_id = auth.uid();
  
  RETURN FOUND;
END;
$$;