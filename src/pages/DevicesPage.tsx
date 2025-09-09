import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import DataTable from '../components/DataTable';
import { Device } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select(`
            id,
            name,
            device_type,
            status,
            location,
            ip_address,
            version,
            last_active,
            branches (
              name,
              code
            )
          `)
          .order('name');

        if (error) throw error;

        // Transform data to match existing Device type
        const transformedDevices: Device[] = data?.map(device => ({
          id: device.id,
          name: device.name,
          type: device.device_type as 'ATM' | 'POS' | 'Security Camera' | 'Server' | 'Network Switch',
          status: device.status as 'online' | 'offline',
          location: device.location || '',
          ipAddress: device.ip_address?.toString() || '',
          version: device.version || '',
          lastActive: device.last_active
        })) || [];

        setDevices(transformedDevices);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Device Name',
      sortable: true,
      render: (value: string, row: Device) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{row.id}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="text-xs">
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
            value === 'online' 
              ? 'bg-success/10 text-success border-success/20' 
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${
            value === 'online' ? 'bg-success' : 'bg-destructive'
          }`} />
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      sortable: true,
      render: (value: string) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
      )
    },
    {
      key: 'version',
      label: 'Version',
      sortable: true,
      render: (value: string) => (
        <Badge variant="secondary" className="text-xs">
          v{value}
        </Badge>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
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
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device Management</h1>
          <p className="text-muted-foreground">Monitor and manage all connected devices</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-success/10 text-success border-success/20">
            {onlineCount} Online
          </Badge>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            {offlineCount} Offline
          </Badge>
        </div>
      </div>

      {/* Devices Table */}
      <DataTable
        columns={columns}
        data={devices}
        searchPlaceholder="Search devices by name, type, location..."
        onRowClick={(device) => {
          console.log('Device clicked:', device);
          // Here you could open a device details modal or navigate to device page
        }}
      />
    </div>
  );
};

export default DevicesPage;