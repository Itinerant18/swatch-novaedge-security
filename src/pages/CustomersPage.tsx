import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataTable from '../components/DataTable';
import { Entity } from '../types/hierarchy';
import { supabase } from '@/integrations/supabase/client';
import { Building2, MapPin, Users, Settings, Eye, TrendingUp } from 'lucide-react';
const CustomersPage: React.FC = () => {
  const [bankData, setBankData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('entities').select('*').eq('entity_type', 'customer').order('entity_name');
        if (error) throw error;

        // Type cast the data to ensure proper typing
        setBankData((data || []).map(item => ({
          ...item,
          entity_type: item.entity_type as any,
          metadata: item.metadata || {},
          parent_id: item.parent_id || null
        })));
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Simple display for now - will be enhanced with actual hierarchy calculations
  const customerStats = bankData.map(customer => ({
    ...customer,
    totalBranches: 0,
    // Will be calculated from hierarchy
    totalDevices: 0,
    // Will be calculated from hierarchy
    onlineDevices: 0,
    // Will be calculated from hierarchy
    uptime: 95 // Placeholder
  }));
  const columns = [{
    key: 'entity_name',
    label: 'Customer Name',
    sortable: true,
    render: (value: string, row: any) => <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{row.metadata?.type || 'Bank'}</div>
        </div>
      </div>
  }, {
    key: 'totalBranches',
    label: 'Branches',
    sortable: true,
    render: (value: number) => <div className="text-center">
        <div className="font-medium text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">Active</div>
      </div>
  }, {
    key: 'totalDevices',
    label: 'Total Devices',
    sortable: true,
    render: (value: number) => <div className="text-center">
        <div className="font-medium text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">Connected</div>
      </div>
  }, {
    key: 'uptime',
    label: 'System Uptime',
    sortable: true,
    render: (value: number) => <div className="flex items-center gap-2">
        <Badge variant="outline" className={`text-xs ${value >= 95 ? 'bg-success/10 text-success border-success/20' : value >= 85 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
          {value}%
        </Badge>
        {value >= 95 && <TrendingUp className="w-4 h-4 text-success" />}
      </div>
  }, {
    key: 'metadata.country',
    label: 'Location',
    render: (_, row: any) => <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground">
          {row.metadata?.city ? `${row.metadata.city}, ${row.metadata?.country || 'India'}` : 'India'}
        </span>
      </div>
  }, {
    key: 'actions',
    label: 'Actions',
    render: (_: any, row: any) => <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => window.location.href = `/hierarchy/${row.id}`}>
          <Eye className="w-4 h-4 mr-1" />
          View Hierarchy
        </Button>
        <Button variant="ghost" size="sm" onClick={() => console.log('Manage:', row.entity_name)}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
  }];
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">Manage banking customers and their infrastructure</p>
        </div>
        
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Building2 className="w-4 h-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Summary Cards */}
      

      {/* Customers Table */}
      <DataTable columns={columns} data={customerStats} searchPlaceholder="Search customers by name, type..." onRowClick={customer => {
      window.location.href = `/hierarchy/${customer.id}`;
    }} />
    </div>;
};
export default CustomersPage;