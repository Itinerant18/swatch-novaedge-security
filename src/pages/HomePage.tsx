import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Building2, 
  Users, 
  Activity,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { DashboardSummary } from '../types';
import { supabase } from '@/integrations/supabase/client';

const HomePage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Fetch devices for dashboard summary
        const { data: devices } = await supabase
          .from('devices')
          .select('status');
        
        // Fetch branches count
        const { data: branches } = await supabase
          .from('branches')
          .select('id');
          
        // Fetch system users count  
        const { data: users } = await supabase
          .from('system_users')
          .select('id');

        if (devices && branches && users) {
          const onlineDevices = devices.filter(d => d.status === 'online').length;
          
          const dashboardData: DashboardSummary = {
            totalDevices: devices.length,
            onlineDevices,
            offlineDevices: devices.length - onlineDevices,
            totalBranches: branches.length,
            totalUsers: users.length,
            lastUpdated: new Date().toISOString()
          };
          
          setSummary(dashboardData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      }
    };
    
    fetchSummary();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const onlinePercentage = Math.round((summary.onlineDevices / summary.totalDevices) * 100);
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of banking infrastructure</p>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <Activity className="w-4 h-4 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Server className="w-4 h-4" />
              Total Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary.totalDevices}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-success">+2.3%</span>
              <span className="text-xs text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Online Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{summary.onlineDevices}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                {onlinePercentage}% uptime
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              Offline Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary.offlineDevices}</div>
            <div className="flex items-center gap-2 mt-2">
              {summary.offlineDevices > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-xs text-warning">Requires attention</span>
                </>
              ) : (
                <span className="text-xs text-success">All systems operational</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Total Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary.totalBranches}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Across all zones
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary.totalUsers}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Monitoring access
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network Connectivity</span>
              <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Security Status</span>
              <Badge className="bg-success/10 text-success border-success/20">Protected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Sync</span>
              <Badge className="bg-warning/10 text-warning border-warning/20">Syncing</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Backup Status</span>
              <Badge className="bg-success/10 text-success border-success/20">Updated</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Device Offline Alert</p>
                <p className="text-xs text-muted-foreground">ATM Terminal 1 at Andheri West Branch</p>
                <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <Activity className="w-4 h-4 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">System Update Completed</p>
                <p className="text-xs text-muted-foreground">Security patches installed across all devices</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Server className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">New Device Registered</p>
                <p className="text-xs text-muted-foreground">POS Terminal 3 at Bandra Branch</p>
                <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-xs text-muted-foreground">
        Last updated: {new Date(summary.lastUpdated).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true
        })} IST
      </div>
    </div>
  );
};

export default HomePage;