import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Components
import LoginPage from './components/LoginPage';
import AppSidebar from './components/AppSidebar';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';

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

const AppContent: React.FC = () => {
  const { user, session, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoginPage />
      </TooltipProvider>
    );
  }

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <Header 
              onLogout={handleLogout}
              currentUser={user?.email ?? 'User'}
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/devices" element={<DevicesPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/hierarchy/:entityId?" element={<HierarchyPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/ota" element={<OTAUpdatesPage />} />
                <Route path="/scheduler" element={<SchedulerPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;