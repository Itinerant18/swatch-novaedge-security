import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  profile?: UserProfile;
  userRole?: 'super_admin' | 'customer_admin' | 'branch_manager' | 'user';
  customerId?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return null;
        }

        return profile;
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
    };

    const setUserWithProfile = async (authUser: User | null) => {
      if (authUser) {
        const profile = await getProfile(authUser.id);
        const enhancedUser: AuthUser = {
          ...authUser,
          profile,
          userRole: profile?.role as any || 'user',
          customerId: profile?.role === 'customer_admin' || profile?.role === 'branch_manager' 
            ? 'customer-id-from-profile' // This would come from a mapping table
            : undefined
        };
        setUser(enhancedUser);
      } else {
        setUser(null);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        await setUserWithProfile(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      await setUserWithProfile(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isSuperAdmin = () => user?.userRole === 'super_admin';
  const isCustomerAdmin = () => user?.userRole === 'customer_admin';
  const isBranchManager = () => user?.userRole === 'branch_manager';

  return {
    user,
    session,
    loading,
    signOut,
    isSuperAdmin,
    isCustomerAdmin,
    isBranchManager,
    userRole: user?.userRole || 'user'
  };
};