import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/DataTable';
import { HardDrive, Plus, Wifi, WifiOff } from 'lucide-react';

const DevicesPage: React.FC = () => {
  // Mock data for devices
  const devices = [
    {
      id: '1',
      name: 'ATM-001',
      type: 'ATM',
      branch: 'Main Branch',
      status: 'online',
      lastActive: '2024-01-15 10:30:00',
      ipAddress: '192.168.1.101',
      version: 'v2.1.3'
    },
    {
      id: '2',
      name: 'POS-002',
      type: 'POS',
      branch: 'Main Branch',
      status: 'online',
      lastActive: '2024-01-15 10:25:00',
      ipAddress: '192.168.1.102',
      version: 'v1.8.2'
    },
    {
      id: '3',
      name: 'CAM-003',
      type: 'Security Camera',
      branch: 'Downtown Branch',
      status: 'offline',
      lastActive: '2024-01-15 08:15:00',
      ipAddress: '192.168.1.103',
      version: 'v3.0.1'
    },
    {
      id: '4',
      name: 'SRV-004',
      type: 'Server',
      branch: 'Main Branch',
      status: 'online',
      lastActive: '2024-01-15 10:32:00',
      ipAddress: '192.168.1.104',
      version: 'v4.2.0'
    }
  ];

  const columns = [
    {
      key: 'name',
      label: 'Device Name',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: 'branch',
      label: 'Branch',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge 
          variant={value === 'online' ? 'default' : 'secondary'}
          className={value === 'online' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}
        >
          {value === 'online' ? (
            <Wifi className="w-3 h-3 mr-1" />
          ) : (
            <WifiOff className="w-3 h-3 mr-1" />
          )}
          {value}
        </Badge>
      ),
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (value: string) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: 'version',
      label: 'Version',
      render: (value: string) => (
        <Badge variant="outline" className="text-xs">{value}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Monitor
          </Button>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
      ),
    },
  ];

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Device Management</h1>
          <p className="text-muted-foreground">Monitor and manage all banking devices</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold text-foreground">{devices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Wifi className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-success">{onlineDevices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                <WifiOff className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-destructive">{offlineDevices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-warning">98.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={devices} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesPage;