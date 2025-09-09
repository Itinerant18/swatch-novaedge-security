import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '../components/DataTable';
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { 
  UserPlus, 
  User as UserIcon, 
  Shield, 
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const UsersPage: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('system_users')
          .select('*')
          .order('name');

        if (error) throw error;

        // Transform data to match existing User type
        const transformedUsers: User[] = data?.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status as 'active' | 'inactive',
          lastLogin: user.last_login || new Date().toISOString(),
          permissions: user.permissions || []
        })) || [];

        setUserData(transformedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'User Details',
      sortable: true,
      render: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-medium text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge 
          variant="outline"
          className={`text-xs ${
            value === 'active' 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${
            value === 'active' ? 'bg-success' : 'bg-destructive'
          }`} />
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 2).map((permission, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {permission}
            </Badge>
          ))}
          {permissions.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{permissions.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          <div className="text-foreground">
            {formatDistanceToNow(new Date(value), { addSuffix: true })}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(value).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour12: true,
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: User) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => console.log('View user:', row.name)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => console.log('Edit user:', row.name)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => console.log('Delete user:', row.name)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeUsers = userData.filter(u => u.status === 'active').length;
  const inactiveUsers = userData.filter(u => u.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-success/10 text-success border-success/20">
            {activeUsers} Active
          </Badge>
          <Badge className="bg-muted/50 text-muted-foreground border-muted">
            {inactiveUsers} Inactive
          </Badge>
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={userData}
        searchPlaceholder="Search users by name, email, role..."
        onRowClick={(user) => {
          console.log('User clicked:', user);
        }}
      />
    </div>
  );
};

export default UsersPage;