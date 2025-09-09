-- Create devices table
CREATE TABLE public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('online', 'offline')),
  location TEXT,
  ip_address INET,
  version TEXT,
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  branch_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banks table
CREATE TABLE public.banks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bank_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create zones table
CREATE TABLE public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  manager TEXT,
  bank_id UUID NOT NULL REFERENCES public.banks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT,
  manager TEXT,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for devices to branches
ALTER TABLE public.devices 
ADD CONSTRAINT fk_devices_branch 
FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;

-- Create system_users table (separate from auth.users for system management)
CREATE TABLE public.system_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  permissions TEXT[] NOT NULL DEFAULT '{}',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin portal access)
CREATE POLICY "Authenticated users can view devices" ON public.devices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage devices" ON public.devices FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view banks" ON public.banks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage banks" ON public.banks FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view zones" ON public.zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage zones" ON public.zones FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view branches" ON public.branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage branches" ON public.branches FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view system users" ON public.system_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage system users" ON public.system_users FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_branch_id ON public.devices(branch_id);
CREATE INDEX idx_zones_bank_id ON public.zones(bank_id);
CREATE INDEX idx_branches_zone_id ON public.branches(zone_id);
CREATE INDEX idx_system_users_status ON public.system_users(status);

-- Insert sample data
INSERT INTO public.banks (name, bank_type) VALUES
  ('State Bank of India', 'SBI'),
  ('Indian Bank', 'Indian Bank');

-- Insert sample zones
INSERT INTO public.zones (name, code, manager, bank_id) VALUES
  ('Mumbai Zone', 'MZ', 'Rajesh Kumar', (SELECT id FROM public.banks WHERE name = 'State Bank of India')),
  ('Delhi Zone', 'DZ', 'Vikram Singh', (SELECT id FROM public.banks WHERE name = 'State Bank of India')),
  ('South Zone', 'SZ', 'Lakshmi Nair', (SELECT id FROM public.banks WHERE name = 'Indian Bank')),
  ('West Zone', 'WZ', 'Arjun Desai', (SELECT id FROM public.banks WHERE name = 'Indian Bank'));

-- Insert sample branches
INSERT INTO public.branches (name, code, address, manager, zone_id) VALUES
  ('Andheri West Branch', 'SBIN0001234', '123 Andheri West, Mumbai - 400058', 'Priya Sharma', 
   (SELECT id FROM public.zones WHERE name = 'Mumbai Zone')),
  ('Bandra Branch', 'SBIN0001235', '456 Bandra, Mumbai - 400050', 'Amit Patel',
   (SELECT id FROM public.zones WHERE name = 'Mumbai Zone')),
  ('Connaught Place Branch', 'SBIN0002001', 'CP Block A, New Delhi - 110001', 'Neha Agarwal',
   (SELECT id FROM public.zones WHERE name = 'Delhi Zone')),
  ('T Nagar Branch', 'IDIB0001001', 'T Nagar, Chennai - 600017', 'Karthik Subramanian',
   (SELECT id FROM public.zones WHERE name = 'South Zone')),
  ('Shivaji Nagar Branch', 'IDIB0002001', 'Shivaji Nagar, Pune - 411005', 'Pooja Marathe',
   (SELECT id FROM public.zones WHERE name = 'West Zone'));

-- Insert sample devices
INSERT INTO public.devices (name, device_type, status, location, ip_address, version, branch_id) VALUES
  ('ATM Terminal 1', 'ATM', 'online', 'Main Entrance', '192.168.1.10', '2.1.4',
   (SELECT id FROM public.branches WHERE name = 'Andheri West Branch')),
  ('POS Terminal 1', 'POS', 'online', 'Counter 1', '192.168.1.11', '1.8.2',
   (SELECT id FROM public.branches WHERE name = 'Andheri West Branch')),
  ('Security Camera 1', 'Security Camera', 'online', 'Main Hall', '192.168.1.12', '3.2.1',
   (SELECT id FROM public.branches WHERE name = 'Andheri West Branch')),
  ('Branch Server', 'Server', 'online', 'Server Room', '192.168.1.1', '4.5.0',
   (SELECT id FROM public.branches WHERE name = 'Andheri West Branch')),
  ('ATM Terminal 1', 'ATM', 'offline', 'Main Entrance', '192.168.2.10', '2.1.4',
   (SELECT id FROM public.branches WHERE name = 'Bandra Branch')),
  ('POS Terminal 1', 'POS', 'online', 'Counter 1', '192.168.2.11', '1.8.2',
   (SELECT id FROM public.branches WHERE name = 'Bandra Branch'));

-- Insert sample system users
INSERT INTO public.system_users (name, email, role, status, permissions, last_login) VALUES
  ('Admin User', 'admin@bankingsec.com', 'System Administrator', 'active', ARRAY['all'], now() - interval '1 hour'),
  ('Security Manager', 'security@bankingsec.com', 'Security Manager', 'active', ARRAY['monitor', 'alerts', 'reports'], now() - interval '2 hours'),
  ('Branch Manager', 'branch@bankingsec.com', 'Branch Manager', 'active', ARRAY['view', 'branch-manage'], now() - interval '3 hours');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_banks_updated_at BEFORE UPDATE ON public.banks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON public.zones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_system_users_updated_at BEFORE UPDATE ON public.system_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();