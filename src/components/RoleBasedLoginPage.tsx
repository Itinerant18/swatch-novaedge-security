import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Eye, EyeOff, Building2, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const RoleBasedLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'banking' | 'super'>('banking');
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      // After successful login, we'll handle role-based routing in App.tsx
      toast({
        title: "Login successful",
        description: `Welcome to the ${loginType === 'banking' ? 'Banking Admin' : 'Super Admin'} portal.`,
      });
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-dashboard border-0 bg-gradient-card">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              {loginType === 'banking' ? (
                <Building2 className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Settings className="w-8 h-8 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {loginType === 'banking' ? 'Banking Admin Portal' : 'Super Admin Portal'}
            </CardTitle>
            <p className="text-muted-foreground">
              {loginType === 'banking' 
                ? 'Branch management and monitoring dashboard' 
                : 'System administration and customer management'}
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={loginType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="banking" onClick={() => setLoginType('banking')}>
                  Banking Admin
                </TabsTrigger>
                <TabsTrigger value="super" onClick={() => setLoginType('super')}>
                  Super Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={loginType} className="space-y-4 mt-6">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-primary hover:bg-primary-hover font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : `Sign In to ${loginType === 'banking' ? 'Banking' : 'Super Admin'} Portal`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                {loginType === 'banking' 
                  ? 'For branch managers and banking administrators only'
                  : 'For system administrators and developers only'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleBasedLoginPage;