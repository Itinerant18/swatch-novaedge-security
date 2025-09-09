import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Components
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
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
const queryClient = new QueryClient();
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState('home');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  useEffect(() => {
    // Set up auth state listener
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveItem('home');
    setExpandedMenus([]);
  };
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  const handleMenuToggle = (menu: string) => {
    setExpandedMenus(prev => prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]);
  };
  if (loading) {
    return <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }
  if (!session) {
    return <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage />
        </TooltipProvider>
      </QueryClientProvider>;
  }
  return <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen bg-dashboard-bg">
            <Sidebar activeItem={activeItem} onItemClick={handleItemClick} expandedMenus={expandedMenus} onMenuToggle={handleMenuToggle} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header onLogout={handleLogout} currentUser={user?.email ?? 'User'} />
              
              
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>;
};
export default App;