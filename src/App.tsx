import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Components
import RoleBasedLoginPage from './components/RoleBasedLoginPage';
import Sidebar from './components/Sidebar';
import BankingSidebar from './components/BankingSidebar';
import Header from './components/Header';

// Pages
import HomePage from './pages/HomePage';
import DevicesPage from './pages/DevicesPage';
import CustomersPage from './pages/CustomersPage';
import HierarchyPage from './pages/HierarchyPage';
import UsersPage from './pages/UsersPage';
import OTAUpdatesPage from './pages/OTAUpdatesPage';
import SchedulerPage from './pages/SchedulerPage';
import NotFound from './pages/NotFound';

// Banking Pages
import BranchesPage from './pages/banking/BranchesPage';
import BankingDevicesPage from './pages/banking/DevicesPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState('home');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<'super_admin' | 'banking_admin' | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role from profile
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            
            // Set role based on profile or default to banking_admin
            setUserRole(profile?.role === 'super_admin' ? 'super_admin' : 'banking_admin');
          } catch (error) {
            // Default to banking_admin if profile not found
            setUserRole('banking_admin');
          }
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch user role from profile
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          // Set role based on profile or default to banking_admin
          setUserRole(profile?.role === 'super_admin' ? 'super_admin' : 'banking_admin');
        } catch (error) {
          // Default to banking_admin if profile not found
          setUserRole('banking_admin');
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveItem('home');
    setExpandedMenus([]);
    setUserRole(null);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleMenuToggle = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RoleBasedLoginPage />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen bg-dashboard-bg">
            {userRole === 'super_admin' ? (
              <Sidebar
                activeItem={activeItem}
                onItemClick={handleItemClick}
                expandedMenus={expandedMenus}
                onMenuToggle={handleMenuToggle}
              />
            ) : (
              <BankingSidebar
                activeItem={activeItem}
                onItemClick={handleItemClick}
                expandedMenus={expandedMenus}
                onMenuToggle={handleMenuToggle}
              />
            )}
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header 
                onLogout={handleLogout}
                currentUser={user?.email ?? 'User'}
              />
              
              <main className="flex-1 overflow-y-auto p-6">
                <Routes>
                  {userRole === 'super_admin' ? (
                    // Super Admin Routes
                    <>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/devices" element={<DevicesPage />} />
                      <Route path="/customers" element={<CustomersPage />} />
                      <Route path="/hierarchy/:entityId?" element={<HierarchyPage />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/ota" element={<OTAUpdatesPage />} />
                      <Route path="/scheduler" element={<SchedulerPage />} />
                      <Route path="*" element={<NotFound />} />
                    </>
                  ) : (
                    // Banking Admin Routes
                    <>
                      <Route path="/" element={<BranchesPage />} />
                      <Route path="/banking/branches" element={<BranchesPage />} />
                      <Route path="/banking/devices" element={<BankingDevicesPage />} />
                      <Route path="/banking/analytics/uptime" element={<div className="p-6"><h1 className="text-3xl font-bold">Uptime Analytics</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                      <Route path="/banking/reports/*" element={<div className="p-6"><h1 className="text-3xl font-bold">Reports</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                      <Route path="/banking/customer" element={<div className="p-6"><h1 className="text-3xl font-bold">Customer</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                      <Route path="*" element={<NotFound />} />
                    </>
                  )}
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;