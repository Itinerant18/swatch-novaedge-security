-- Create dynamic hierarchy entity table
CREATE TABLE public.entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'zone', 'nbg', 'ro', 'branch', 'device')),
  entity_name TEXT NOT NULL,
  parent_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

-- Create policies for entity access
CREATE POLICY "Authenticated users can view entities" 
ON public.entities 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage entities" 
ON public.entities 
FOR ALL 
USING (true);

-- Create index for better performance on parent lookups
CREATE INDEX idx_entities_parent_id ON public.entities(parent_id);
CREATE INDEX idx_entities_type ON public.entities(entity_type);

-- Create hierarchy configuration table
CREATE TABLE public.hierarchy_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  hierarchy_levels TEXT[] NOT NULL, -- e.g., ['zone', 'branch', 'device'] or ['zone', 'nbg', 'ro', 'branch', 'device']
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for hierarchy configs
ALTER TABLE public.hierarchy_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view hierarchy configs" 
ON public.hierarchy_configs 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage hierarchy configs" 
ON public.hierarchy_configs 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_entities_updated_at
BEFORE UPDATE ON public.entities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hierarchy_configs_updated_at
BEFORE UPDATE ON public.hierarchy_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
-- SBI Customer
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'customer', 'State Bank of India', NULL, '{"email": "admin@sbi.co.in", "country": "India", "city": "Mumbai", "type": "SBI"}');

-- SBI Zones
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'zone', 'Mumbai Zone', '550e8400-e29b-41d4-a716-446655440001', '{"code": "MZ001", "manager": "Rajesh Kumar"}'),
('550e8400-e29b-41d4-a716-446655440003', 'zone', 'Delhi Zone', '550e8400-e29b-41d4-a716-446655440001', '{"code": "DZ002", "manager": "Priya Sharma"}');

-- SBI Branches
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440004', 'branch', 'Andheri Branch', '550e8400-e29b-41d4-a716-446655440002', '{"code": "SBI001", "address": "Andheri West, Mumbai", "manager": "Amit Patel"}'),
('550e8400-e29b-41d4-a716-446655440005', 'branch', 'Bandra Branch', '550e8400-e29b-41d4-a716-446655440002', '{"code": "SBI002", "address": "Bandra East, Mumbai", "manager": "Sunita Joshi"}'),
('550e8400-e29b-41d4-a716-446655440006', 'branch', 'Connaught Place Branch', '550e8400-e29b-41d4-a716-446655440003', '{"code": "SBI003", "address": "CP, New Delhi", "manager": "Vikram Singh"}');

-- Indian Bank Customer
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440007', 'customer', 'Indian Bank', NULL, '{"email": "admin@indianbank.co.in", "country": "India", "city": "Chennai", "type": "Indian Bank"}');

-- Indian Bank Zone
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440008', 'zone', 'Chennai Zone', '550e8400-e29b-41d4-a716-446655440007', '{"code": "CZ001", "manager": "Ravi Murugan"}');

-- Indian Bank NBG
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440009', 'nbg', 'Chennai NBG', '550e8400-e29b-41d4-a716-446655440008', '{"code": "NBG001", "manager": "Lakshmi Krishnan"}');

-- Indian Bank RO
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'ro', 'T.Nagar RO', '550e8400-e29b-41d4-a716-446655440009', '{"code": "RO001", "manager": "Suresh Kumar"}');

-- Indian Bank Branch
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'branch', 'T.Nagar Branch', '550e8400-e29b-41d4-a716-446655440010', '{"code": "IB001", "address": "T.Nagar, Chennai", "manager": "Meera Devi"}');

-- Sample Devices
INSERT INTO public.entities (id, entity_type, entity_name, parent_id, metadata) VALUES 
('550e8400-e29b-41d4-a716-446655440012', 'device', 'ATM-001', '550e8400-e29b-41d4-a716-446655440004', '{"type": "ATM", "status": "online", "ip_address": "192.168.1.101", "version": "v2.1.3", "last_active": "2024-01-09T10:30:00Z"}'),
('550e8400-e29b-41d4-a716-446655440013', 'device', 'Security Camera-001', '550e8400-e29b-41d4-a716-446655440004', '{"type": "Security Camera", "status": "online", "ip_address": "192.168.1.102", "version": "v1.8.2", "last_active": "2024-01-09T10:25:00Z"}'),
('550e8400-e29b-41d4-a716-446655440014', 'device', 'ATM-002', '550e8400-e29b-41d4-a716-446655440011', '{"type": "ATM", "status": "offline", "ip_address": "192.168.2.101", "version": "v2.1.3", "last_active": "2024-01-08T15:20:00Z"}');

-- Insert hierarchy configurations
INSERT INTO public.hierarchy_configs (customer_id, hierarchy_levels) VALUES 
('550e8400-e29b-41d4-a716-446655440001', ARRAY['zone', 'branch', 'device']), -- SBI: HO → Zone → Branch → Device
('550e8400-e29b-41d4-a716-446655440007', ARRAY['zone', 'nbg', 'ro', 'branch', 'device']); -- Indian Bank: HO → Zone → NBG → RO → Branch → Device