import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  HardDrive, 
  Users, 
  Building2, 
  Settings, 
  Download,
  Calendar,
  ChevronRight,
  ChevronDown,
  Shield,
  Database,
  Network,
  Activity
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, isCustomerAdmin, userRole } = useAuth();

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Dynamic menu based on user role
  const getMenuItems = () => {
    const baseItems = [
      { 
        id: 'home', 
        label: 'Home', 
        icon: Home, 
        path: '/home' 
      },
      { 
        id: 'dashboards', 
        label: 'Dashboards', 
        icon: BarChart3, 
        submenu: [
          { id: 'overview', label: 'Overview', path: '/dashboard/overview' },
          { id: 'analytics', label: 'Analytics', path: '/dashboard/analytics' },
          { id: 'reports', label: 'Reports', path: '/dashboard/reports' }
        ]
      }
    ];

    if (isSuperAdmin()) {
      // Super Admin Portal - sees everything
      baseItems.push(
        { 
          id: 'entities', 
          label: 'Entities', 
          icon: Database, 
          submenu: [
            { id: 'devices', label: 'Devices', path: '/devices' },
            { id: 'all-branches', label: 'All Branches', path: '/entities/branches' },
            { id: 'all-zones', label: 'All Zones', path: '/entities/zones' }
          ]
        },
        { 
          id: 'customers', 
          label: 'Customers', 
          icon: Building2, 
          path: '/customers' 
        },
        { 
          id: 'users', 
          label: 'Users', 
          icon: Users, 
          path: '/users' 
        },
        { 
          id: 'advanced', 
          label: 'Advanced Features', 
          icon: Settings, 
          submenu: [
            { id: 'ota-updates', label: 'OTA Updates', path: '/ota' },
            { id: 'scheduler', label: 'Scheduler', path: '/scheduler' },
            { id: 'system-config', label: 'System Config', path: '/admin/config' }
          ]
        }
      );
    } else {
      // Customer Portal - limited view
      baseItems.push(
        { 
          id: 'entities', 
          label: 'Entities', 
          icon: Database, 
          submenu: [
            { id: 'devices', label: 'Devices', path: '/devices' }
          ]
        },
        { 
          id: 'hierarchy', 
          label: 'Organization', 
          icon: Network, 
          path: '/hierarchy' 
        }
      );

      if (isCustomerAdmin()) {
        baseItems.push({
          id: 'users', 
          label: 'Users', 
          icon: Users, 
          path: '/users'
        });
      }

      baseItems.push({
        id: 'advanced', 
        label: 'Operations', 
        icon: Settings, 
        submenu: [
          { id: 'ota-updates', label: 'OTA Updates', path: '/ota' },
          { id: 'scheduler', label: 'Scheduler', path: '/scheduler' }
        ]
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const getPortalTitle = () => {
    if (isSuperAdmin()) return 'Super Admin Portal';
    if (isCustomerAdmin()) return 'Customer Admin Portal';
    return 'SecureBank Portal';
  };

  const getPortalSubtitle = () => {
    if (isSuperAdmin()) return 'System Management';
    if (isCustomerAdmin()) return 'Customer Management';
    return 'Monitoring Dashboard';
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{getPortalTitle()}</h1>
            <p className="text-xs text-muted-foreground">{getPortalSubtitle()}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.submenu ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isActiveRoute(subItem.path)}
                              >
                                <button 
                                  onClick={() => navigate(subItem.path)}
                                  className="w-full text-left"
                                >
                                  {subItem.label}
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      isActive={isActiveRoute(item.path)}
                    >
                      <button 
                        onClick={() => navigate(item.path)}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <Activity className="w-5 h-5" />
                  <span>Status: Online</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;