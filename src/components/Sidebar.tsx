import React from 'react';
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
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  expandedMenus: string[];
  onMenuToggle: (menu: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home, hasSubmenu: false },
  { 
    id: 'dashboards', 
    label: 'Dashboards', 
    icon: BarChart3, 
    hasSubmenu: true,
    submenu: [
      { id: 'dashboard-overview', label: 'Overview' },
      { id: 'dashboard-analytics', label: 'Analytics' }
    ]
  },
  { 
    id: 'entities', 
    label: 'Entities', 
    icon: HardDrive, 
    hasSubmenu: true,
    submenu: [
      { id: 'devices', label: 'Devices' }
    ]
  },
  { id: 'customers', label: 'Customers', icon: Building2, hasSubmenu: false },
  { id: 'users', label: 'Users', icon: Users, hasSubmenu: false },
  { 
    id: 'advanced', 
    label: 'Advanced Features', 
    icon: Settings, 
    hasSubmenu: true,
    submenu: [
      { id: 'ota-updates', label: 'OTA Updates' },
      { id: 'scheduler', label: 'Scheduler' }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  activeItem, 
  onItemClick, 
  expandedMenus, 
  onMenuToggle 
}) => {
  const isExpanded = (menuId: string) => expandedMenus.includes(menuId);

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-foreground/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">SecureBank</h1>
            <p className="text-xs text-sidebar-foreground/60">Monitoring Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  onMenuToggle(item.id);
                } else {
                  onItemClick(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                activeItem === item.id 
                  ? 'bg-sidebar-active text-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-foreground/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.hasSubmenu && (
                isExpanded(item.id) ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {/* Submenu */}
            {item.hasSubmenu && isExpanded(item.id) && (
              <div className="ml-6 mt-2 space-y-1 border-l border-sidebar-foreground/20 pl-4">
                {item.submenu?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onItemClick(subItem.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors duration-200 ${
                      activeItem === subItem.id 
                        ? 'bg-sidebar-active/80 text-primary-foreground' 
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-foreground/10'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-foreground/10">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          <p>SecureBank Portal v2.1</p>
          <p className="mt-1">© 2024 Banking Security</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;