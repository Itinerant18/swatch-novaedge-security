import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  HardDrive, 
  BarChart3, 
  FileText,
  Users2,
  ChevronRight,
  ChevronDown,
  Shield,
  TrendingUp,
  Camera,
  Zap,
  ShieldCheck,
  UserCheck,
  Timer,
  AirVent
} from 'lucide-react';

interface BankingSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  expandedMenus: string[];
  onMenuToggle: (menu: string) => void;
}

const bankingMenuItems = [
  { 
    id: 'branch-list', 
    label: 'Branch List', 
    icon: Building2, 
    hasSubmenu: false, 
    path: '/banking/branches' 
  },
  { 
    id: 'device-list', 
    label: 'Device List', 
    icon: HardDrive, 
    hasSubmenu: false, 
    path: '/banking/devices' 
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    hasSubmenu: true,
    submenu: [
      { id: 'uptime-analytics', label: 'Uptime Analytics', path: '/banking/analytics/uptime', icon: TrendingUp }
    ]
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: FileText, 
    hasSubmenu: true,
    submenu: [
      { id: 'branch-report', label: 'Branch Report', path: '/banking/reports/branch', icon: Building2 },
      { id: 'uptime-report', label: 'Uptime Report', path: '/banking/reports/uptime', icon: Timer },
      { id: 'gateway-report', label: 'Gateway Report', path: '/banking/reports/gateway', icon: Zap },
      { id: 'cctv-report', label: 'CCTV', path: '/banking/reports/cctv', icon: Camera },
      { id: 'ias-report', label: 'IAS', path: '/banking/reports/ias', icon: ShieldCheck },
      { id: 'bas-report', label: 'BAS', path: '/banking/reports/bas', icon: Shield },
      { id: 'fas-report', label: 'FAS', path: '/banking/reports/fas', icon: Zap },
      { id: 'tl-report', label: 'TL', path: '/banking/reports/tl', icon: UserCheck },
      { id: 'ac-report', label: 'AC', path: '/banking/reports/ac', icon: AirVent }
    ]
  },
  { 
    id: 'customer', 
    label: 'Customer', 
    icon: Users2, 
    hasSubmenu: false, 
    path: '/banking/customer' 
  }
];

const BankingSidebar: React.FC<BankingSidebarProps> = ({ 
  activeItem, 
  onItemClick, 
  expandedMenus, 
  onMenuToggle 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isExpanded = (menuId: string) => expandedMenus.includes(menuId);

  const handleNavigation = (item: any) => {
    if (item.hasSubmenu) {
      onMenuToggle(item.id);
    } else {
      onItemClick(item.id);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const handleSubmenuNavigation = (subItem: any) => {
    onItemClick(subItem.id);
    if (subItem.path) {
      navigate(subItem.path);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-foreground/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">BankAdmin</h1>
            <p className="text-xs text-sidebar-foreground/60">Banking Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {bankingMenuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                (activeItem === item.id || (item.path && isActiveRoute(item.path)))
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
                    onClick={() => handleSubmenuNavigation(subItem)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors duration-200 ${
                      (activeItem === subItem.id || (subItem.path && isActiveRoute(subItem.path)))
                        ? 'bg-sidebar-active/80 text-primary-foreground' 
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-foreground/10'
                    }`}
                  >
                    {subItem.icon && <subItem.icon className="w-4 h-4" />}
                    <span>{subItem.label}</span>
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
          <p>Banking Admin Portal v1.0</p>
          <p className="mt-1">© 2024 SecureBank</p>
        </div>
      </div>
    </div>
  );
};

export default BankingSidebar;