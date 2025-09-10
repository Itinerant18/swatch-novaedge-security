-- Create user roles enum
CREATE TYPE user_role AS ENUM ('super_admin', 'customer_admin', 'branch_manager', 'user');

-- Update profiles table to use the enum and add customer relationship
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE user_role USING role::user_role,
  ALTER COLUMN role SET DEFAULT 'user'::user_role,
  ADD COLUMN customer_id UUID REFERENCES public.entities(id);

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE user_id = $1
$$;

-- Create function to get user customer
CREATE OR REPLACE FUNCTION public.get_user_customer(user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT customer_id FROM public.profiles WHERE user_id = $1
$$;

-- Update RLS policies for entities based on user roles
DROP POLICY IF EXISTS "Authenticated users can view entities" ON public.entities;
DROP POLICY IF EXISTS "Authenticated users can manage entities" ON public.entities;

-- Super admins can see everything
CREATE POLICY "Super admins can manage all entities"
ON public.entities
FOR ALL
TO authenticated
USING (public.get_user_role(auth.uid()) = 'super_admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'super_admin');

-- Customer admins can see their customer hierarchy
CREATE POLICY "Customer admins can view their entities"
ON public.entities
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'customer_admin' AND (
    -- Can see their customer
    id = public.get_user_customer(auth.uid()) OR
    -- Can see entities in their customer hierarchy
    EXISTS (
      WITH RECURSIVE entity_hierarchy AS (
        -- Start with the customer entity
        SELECT id, parent_id FROM public.entities WHERE id = public.get_user_customer(auth.uid())
        UNION ALL
        -- Recursively find all child entities
        SELECT e.id, e.parent_id FROM public.entities e
        INNER JOIN entity_hierarchy eh ON eh.id = e.parent_id
      )
      SELECT 1 FROM entity_hierarchy WHERE id = entities.id
    )
  )
);

CREATE POLICY "Customer admins can manage their entities"
ON public.entities
FOR ALL
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'customer_admin' AND (
    -- Can manage their customer
    id = public.get_user_customer(auth.uid()) OR
    -- Can manage entities in their customer hierarchy
    EXISTS (
      WITH RECURSIVE entity_hierarchy AS (
        -- Start with the customer entity
        SELECT id, parent_id FROM public.entities WHERE id = public.get_user_customer(auth.uid())
        UNION ALL
        -- Recursively find all child entities
        SELECT e.id, e.parent_id FROM public.entities e
        INNER JOIN entity_hierarchy eh ON eh.id = e.parent_id
      )
      SELECT 1 FROM entity_hierarchy WHERE id = entities.id
    )
  )
)
WITH CHECK (
  public.get_user_role(auth.uid()) = 'customer_admin' AND (
    parent_id = public.get_user_customer(auth.uid()) OR
    EXISTS (
      WITH RECURSIVE entity_hierarchy AS (
        SELECT id, parent_id FROM public.entities WHERE id = public.get_user_customer(auth.uid())
        UNION ALL
        SELECT e.id, e.parent_id FROM public.entities e
        INNER JOIN entity_hierarchy eh ON eh.id = e.parent_id
      )
      SELECT 1 FROM entity_hierarchy WHERE id = entities.parent_id
    )
  )
);

-- Branch managers can only see their branch and devices
CREATE POLICY "Branch managers can view their branch"
ON public.entities
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'branch_manager' AND (
    -- Direct access to their assigned entities (would need a user_entity_assignments table)
    -- For now, simplified to any branch-level entities
    entity_type IN ('branch', 'device')
  )
);

-- Regular users can only view entities (read-only)
CREATE POLICY "Users can view entities"
ON public.entities
FOR SELECT
TO authenticated
USING (public.get_user_role(auth.uid()) = 'user');

-- Insert sample admin user (update this with a real user ID after signup)
-- This is a placeholder - you'll need to update with actual user IDs
INSERT INTO public.profiles (user_id, display_name, role) 
VALUES 
  -- Replace with actual user UUIDs after user registration
  ('00000000-0000-0000-0000-000000000000', 'Super Admin', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET 
  role = EXCLUDED.role,
  display_name = EXCLUDED.display_name;