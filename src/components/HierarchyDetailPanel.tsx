import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Filter, 
  MoreVertical,
  Building2,
  MapPin,
  Users,
  Server,
  Monitor,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import DataTable from './DataTable';
import Breadcrumb from './Breadcrumb';
import EntityIcon from './EntityIcon';
import { Entity, EntityType, BreadcrumbItem } from '@/types/hierarchy';

interface HierarchyNode extends Entity {
  children?: HierarchyNode[];
  childCount?: number;
  level?: number;
}

interface HierarchyDetailPanelProps {
  selectedNode: HierarchyNode | null;
  breadcrumbs: BreadcrumbItem[];
  onNodeAction: (action: 'add' | 'edit' | 'delete', node: HierarchyNode) => void;
  loading?: boolean;
}

const HierarchyDetailPanel: React.FC<HierarchyDetailPanelProps> = ({
  selectedNode,
  breadcrumbs,
  onNodeAction,
  loading = false
}) => {
  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Customer or Entity</h3>
          <p className="text-muted-foreground">Choose an item from the tree view to see details</p>
        </div>
      </div>
    );
  }

  const getEntityTypeLabel = (type: EntityType): string => {
    const labels: Record<EntityType, string> = {
      customer: 'Customer',
      zone: 'Zone',
      nbg: 'NBG',
      ro: 'RO',
      branch: 'Branch',
      device: 'Device'
    };
    return labels[type] || type;
  };

  const getChildEntityType = (parentType: EntityType): EntityType | null => {
    const childMap: Record<EntityType, EntityType | null> = {
      customer: 'zone',
      zone: 'branch',
      nbg: 'ro',
      ro: 'branch',
      branch: 'device',
      device: null
    };
    return childMap[parentType];
  };

  const getAddButtonText = (parentType: EntityType): string => {
    const childType = getChildEntityType(parentType);
    if (!childType) return 'Add Item';
    return `Add ${getEntityTypeLabel(childType)}`;
  };

  const getTableColumns = () => {
    const childType = getChildEntityType(selectedNode.entity_type as EntityType);
    
    if (!childType) {
      // Device level - show device details
      return [
        {
          key: 'entity_name',
          label: 'Device Name',
          sortable: true,
          render: (value: string, row: any) => (
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{row.metadata?.type || 'ATM'}</div>
              </div>
            </div>
          )
        },
        {
          key: 'metadata.ip_address',
          label: 'IP Address',
          render: (_, row: any) => (
            <div className="font-mono text-sm">
              {row.metadata?.ip_address || '192.168.1.100'}
            </div>
          )
        },
        {
          key: 'metadata.status',
          label: 'Status',
          render: (_, row: any) => {
            const status = row.metadata?.status || 'online';
            return (
              <div className="flex items-center gap-2">
                {status === 'online' ? (
                  <Wifi className="w-4 h-4 text-success" />
                ) : (
                  <WifiOff className="w-4 h-4 text-destructive" />
                )}
                <Badge 
                  variant={status === 'online' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {status}
                </Badge>
              </div>
            );
          }
        },
        {
          key: 'metadata.last_active',
          label: 'Last Active',
          render: (_, row: any) => (
            <div className="text-sm text-muted-foreground">
              {row.metadata?.last_active || '2 min ago'}
            </div>
          )
        }
      ];
    }

    // Parent entity level - show children
    return [
      {
        key: 'entity_name',
        label: `${getEntityTypeLabel(childType)} Name`,
        sortable: true,
        render: (value: string, row: any) => (
          <div className="flex items-center gap-3">
            <EntityIcon type={childType} className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{row.metadata?.type || ''}</div>
            </div>
          </div>
        )
      },
      {
        key: 'childCount',
        label: childType === 'device' ? 'Devices' : 'Children',
        sortable: true,
        render: (_, row: any) => (
          <div className="text-center">
            <div className="font-medium text-foreground">{row.childCount || 0}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        )
      },
      {
        key: 'metadata.location',
        label: 'Location',
        render: (_, row: any) => (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {row.metadata?.city || 'Mumbai'}, {row.metadata?.country || 'India'}
            </span>
          </div>
        )
      },
      {
        key: 'metadata.manager',
        label: 'Manager',
        render: (_, row: any) => (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {row.metadata?.manager || 'John Doe'}
            </span>
          </div>
        )
      }
    ];
  };

  const actionColumns = {
    key: 'actions',
    label: 'Actions',
    render: (_: any, row: any) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNodeAction('edit', row)}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onNodeAction('delete', row)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  };

  const columns = [...getTableColumns(), actionColumns];
  const tableData = selectedNode.children || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Breadcrumb items={breadcrumbs} className="mb-4" />
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <EntityIcon 
                type={selectedNode.entity_type as EntityType} 
                className="w-6 h-6 text-primary-foreground" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedNode.entity_name}</h1>
              <p className="text-muted-foreground">
                {getEntityTypeLabel(selectedNode.entity_type as EntityType)}
                {selectedNode.metadata?.type && ` • ${selectedNode.metadata.type}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => onNodeAction('add', selectedNode)}
              disabled={!getChildEntityType(selectedNode.entity_type as EntityType)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {getAddButtonText(selectedNode.entity_type as EntityType)}
            </Button>
          </div>
        </div>
      </div>

      {/* Entity Details Cards */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server className="w-4 h-4" />
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {selectedNode.children?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {selectedNode.children?.filter(child => 
                  child.metadata?.status === 'online' || !child.metadata?.status
                ).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-foreground">
                {selectedNode.metadata?.city || 'Mumbai'}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedNode.metadata?.country || 'India'}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-foreground">
                {selectedNode.metadata?.manager || 'John Doe'}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedNode.metadata?.contact || '+91 98765 43210'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 p-6 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={tableData} 
          searchPlaceholder={`Search ${getChildEntityType(selectedNode.entity_type as EntityType) || 'items'}...`}
          onRowClick={(item) => {
            // Handle row click if needed
            console.log('Row clicked:', item);
          }}
        />
      </div>
    </div>
  );
};

export default HierarchyDetailPanel;