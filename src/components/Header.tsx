import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Bell, 
  Search, 
  User, 
  LogOut,
  Settings,
  Clock
} from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  currentUser?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentUser = 'Admin User' }) => {
  const currentTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left side - Search */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search devices, branches, users..."
            className="w-80 h-9 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Right side - Status and User */}
      <div className="flex items-center gap-4">
        {/* Current Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{currentTime} IST</span>
        </div>

        {/* System Status */}
        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
          <div className="w-2 h-2 rounded-full bg-success mr-2" />
          All Systems Operational
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{currentUser}</p>
              <p className="text-xs text-muted-foreground">System Admin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;