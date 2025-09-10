-- Create user roles enum
CREATE TYPE user_role AS ENUM ('super_admin', 'customer_admin', 'branch_manager', 'user');

-- First drop the default, then change the type, then set new default
ALTER TABLE public.profiles 
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE user_role USING 
    CASE 
      WHEN role = 'user' THEN 'user'::user_role
      WHEN role = 'admin' THEN 'super_admin'::user_role
      ELSE 'user'::user_role
    END,
  ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Add customer relationship
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.entities(id);

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
    id = public.get_user_customer(auth.uid()) OR
    EXISTS (
      WITH RECURSIVE entity_hierarchy AS (
        SELECT id, parent_id FROM public.entities WHERE id = public.get_user_customer(auth.uid())
        UNION ALL
        SELECT e.id, e.parent_id FROM public.entities e
        INNER JOIN entity_hierarchy eh ON eh.id = e.parent_id
      )
      SELECT 1 FROM entity_hierarchy WHERE id = entities.id
    )
  )
);

CREATE POLICY "Customer admins can manage their entities"
ON public.entities
FOR INSERT
TO authenticated
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

CREATE POLICY "Customer admins can update their entities"
ON public.entities
FOR UPDATE
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'customer_admin' AND (
    id = public.get_user_customer(auth.uid()) OR
    EXISTS (
      WITH RECURSIVE entity_hierarchy AS (
        SELECT id, parent_id FROM public.entities WHERE id = public.get_user_customer(auth.uid())
        UNION ALL
        SELECT e.id, e.parent_id FROM public.entities e
        INNER JOIN entity_hierarchy eh ON eh.id = e.parent_id
      )
      SELECT 1 FROM entity_hierarchy WHERE id = entities.id
    )
  )
);

CREATE POLICY "Customer admins can delete their entities"
ON public.entities
FOR DELETE
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'customer_admin' AND (
    id = public.get_user_customer(auth.uid()) OR
    EXISTS (
      WITH RECURSIVE entity_hierarchy AS (
        SELECT id, parent_id FROM public.entities WHERE id = public.get_user_customer(auth.uid())
        UNION ALL
        SELECT e.id, e.parent_id FROM public.entities e
        INNER JOIN entity_hierarchy eh ON eh.id = e.parent_id
      )
      SELECT 1 FROM entity_hierarchy WHERE id = entities.id
    )
  )
);

-- Branch managers can only see their branch and devices
CREATE POLICY "Branch managers can view their branch"
ON public.entities
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'branch_manager' AND
  entity_type IN ('branch', 'device')
);

-- Regular users can only view entities (read-only)
CREATE POLICY "Users can view entities"
ON public.entities
FOR SELECT
TO authenticated
USING (public.get_user_role(auth.uid()) = 'user');