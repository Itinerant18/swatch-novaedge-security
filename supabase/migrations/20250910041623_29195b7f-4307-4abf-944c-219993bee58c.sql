-- Fix recursive RLS policies by creating helper function
CREATE OR REPLACE FUNCTION public.is_within_customer_scope(entity_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE entity_hierarchy AS (
    -- Start from user's customer
    SELECT id, parent_id
    FROM public.entities
    WHERE id = (SELECT customer_id FROM public.profiles WHERE user_id = $2)
    
    UNION ALL
    
    -- Recursively find all children
    SELECT e.id, e.parent_id
    FROM public.entities e
    JOIN entity_hierarchy eh ON eh.id = e.parent_id
  )
  SELECT EXISTS (
    SELECT 1 FROM entity_hierarchy WHERE id = $1
  ) OR $1 = (SELECT customer_id FROM public.profiles WHERE user_id = $2);
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Customer admins can view their entities" ON public.entities;
DROP POLICY IF EXISTS "Customer admins can manage their entities" ON public.entities;
DROP POLICY IF EXISTS "Customer admins can update their entities" ON public.entities;
DROP POLICY IF EXISTS "Customer admins can delete their entities" ON public.entities;

-- Create new non-recursive policies using the helper function
CREATE POLICY "Customer admins can view entities in scope"
ON public.entities
FOR SELECT
TO authenticated
USING (
  get_user_role(auth.uid()) = 'customer_admin'::user_role 
  AND is_within_customer_scope(id, auth.uid())
);

CREATE POLICY "Customer admins can insert entities in scope"
ON public.entities
FOR INSERT
TO authenticated
WITH CHECK (
  get_user_role(auth.uid()) = 'customer_admin'::user_role 
  AND (
    parent_id IS NULL 
    OR is_within_customer_scope(parent_id, auth.uid())
  )
);

CREATE POLICY "Customer admins can update entities in scope"
ON public.entities
FOR UPDATE
TO authenticated
USING (
  get_user_role(auth.uid()) = 'customer_admin'::user_role 
  AND is_within_customer_scope(id, auth.uid())
);

CREATE POLICY "Customer admins can delete entities in scope"
ON public.entities
FOR DELETE
TO authenticated
USING (
  get_user_role(auth.uid()) = 'customer_admin'::user_role 
  AND is_within_customer_scope(id, auth.uid())
);