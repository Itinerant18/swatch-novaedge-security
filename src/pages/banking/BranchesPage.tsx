import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, HardDrive, Plus } from 'lucide-react';

const BranchesPage: React.FC = () => {
  // Mock data for branches
  const branches = [
    {
      id: '1',
      name: 'Main Branch',
      code: 'MB001',
      address: '123 Banking Street, Financial District',
      manager: 'John Smith',
      devices: 25,
      onlineDevices: 23,
      status: 'active'
    },
    {
      id: '2',
      name: 'Downtown Branch',
      code: 'DT002',
      address: '456 Commerce Ave, Downtown',
      manager: 'Sarah Johnson',
      devices: 18,
      onlineDevices: 16,
      status: 'active'
    },
    {
      id: '3',
      name: 'Suburban Branch',
      code: 'SB003',
      address: '789 Residential Blvd, Suburbs',
      manager: 'Mike Wilson',
      devices: 12,
      onlineDevices: 11,
      status: 'maintenance'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Branch Management</h1>
          <p className="text-muted-foreground">Manage and monitor all bank branches</p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Branches</p>
                <p className="text-2xl font-bold text-foreground">{branches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold text-foreground">
                  {branches.reduce((sum, branch) => sum + branch.devices, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Online Devices</p>
                <p className="text-2xl font-bold text-success">
                  {branches.reduce((sum, branch) => sum + branch.onlineDevices, 0)}
                </p>
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
                <p className="text-sm text-muted-foreground">Offline Devices</p>
                <p className="text-2xl font-bold text-warning">
                  {branches.reduce((sum, branch) => sum + (branch.devices - branch.onlineDevices), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{branch.name}</CardTitle>
                <Badge 
                  variant={branch.status === 'active' ? 'default' : 'secondary'}
                  className={branch.status === 'active' ? 'bg-success text-success-foreground' : ''}
                >
                  {branch.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{branch.code}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">{branch.address}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Manager: {branch.manager}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{branch.devices}</p>
                  <p className="text-xs text-muted-foreground">Total Devices</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-success">{branch.onlineDevices}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-warning">{branch.devices - branch.onlineDevices}</p>
                  <p className="text-xs text-muted-foreground">Offline</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BranchesPage;