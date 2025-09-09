import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, Settings, Users as UsersIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Entity, EntityType, BreadcrumbItem, HierarchyConfig } from '@/types/hierarchy';
import Breadcrumb from '@/components/Breadcrumb';
import EntityIcon from '@/components/EntityIcon';
import DataTable from '@/components/DataTable';

const HierarchyPage: React.FC = () => {
  const { entityId } = useParams<{ entityId?: string }>();
  const navigate = useNavigate();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [hierarchyConfig, setHierarchyConfig] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (entityId) {
      fetchEntityDetails(entityId);
    } else {
      fetchCustomers();
    }
  }, [entityId]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('entity_type', 'customer')
        .order('entity_name');

      if (error) throw error;
      setEntities((data || []).map(item => ({ 
        ...item, 
        entity_type: item.entity_type as EntityType,
        metadata: item.metadata || {},
        parent_id: item.parent_id || null
      })));
      setCurrentEntity(null);
      setBreadcrumbs([]);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityDetails = async (id: string) => {
    try {
      setLoading(true);
      
      // Get current entity
      const { data: entity, error: entityError } = await supabase
        .from('entities')
        .select('*')
        .eq('id', id)
        .single();

      if (entityError) throw entityError;
      setCurrentEntity({ 
        ...entity, 
        entity_type: entity.entity_type as EntityType,
        metadata: entity.metadata || {},
        parent_id: entity.parent_id || null
      });

      // Get hierarchy config for this customer
      const customerId = await findRootCustomer({ 
        ...entity, 
        entity_type: entity.entity_type as EntityType,
        metadata: entity.metadata || {},
        parent_id: entity.parent_id || null
      });
      if (customerId) {
        const { data: config, error: configError } = await supabase
          .from('hierarchy_configs')
          .select('hierarchy_levels')
          .eq('customer_id', customerId)
          .single();

        if (!configError && config) {
          setHierarchyConfig(config.hierarchy_levels);
        }
      }

      // Get children entities
      const { data: children, error: childrenError } = await supabase
        .from('entities')
        .select('*')
        .eq('parent_id', id)
        .order('entity_name');

      if (childrenError) throw childrenError;
      setEntities((children || []).map(item => ({ 
        ...item, 
        entity_type: item.entity_type as EntityType,
        metadata: item.metadata || {},
        parent_id: item.parent_id || null
      })));

      // Build breadcrumbs
      await buildBreadcrumbs({ 
        ...entity, 
        entity_type: entity.entity_type as EntityType,
        metadata: entity.metadata || {},
        parent_id: entity.parent_id || null
      });
    } catch (error) {
      console.error('Error fetching entity details:', error);
    } finally {
      setLoading(false);
    }
  };

  const findRootCustomer = async (entity: Entity): Promise<string | null> => {
    let current = entity;
    
    while (current.parent_id) {
      const { data: parent, error } = await supabase
        .from('entities')
        .select('*')
        .eq('id', current.parent_id)
        .single();
      
      if (error) return null;
      current = { 
        ...parent, 
        entity_type: parent.entity_type as EntityType,
        metadata: parent.metadata || {},
        parent_id: parent.parent_id || null
      };
    }
    
    return current.entity_type === 'customer' ? current.id : null;
  };

  const buildBreadcrumbs = async (entity: Entity) => {
    const crumbs: BreadcrumbItem[] = [];
    let current = entity;

    // Build path from current entity to root
    while (current) {
      crumbs.unshift({
        id: current.id,
        name: current.entity_name,
        type: current.entity_type,
        url: current.parent_id ? `/hierarchy/${current.id}` : '/customers'
      });

      if (current.parent_id) {
        const { data: parent, error } = await supabase
          .from('entities')
          .select('*')
          .eq('id', current.parent_id)
          .single();
        
        if (error) break;
        current = { 
          ...parent, 
          entity_type: parent.entity_type as EntityType,
          metadata: parent.metadata || {},
          parent_id: parent.parent_id || null
        };
      } else {
        break;
      }
    }

    setBreadcrumbs(crumbs);
  };

  const getNextEntityType = (currentType: EntityType): EntityType | null => {
    if (!hierarchyConfig.length) return null;
    
    if (currentType === 'customer' && hierarchyConfig.length > 0) {
      return hierarchyConfig[0] as EntityType;
    }
    
    const currentIndex = hierarchyConfig.indexOf(currentType);
    if (currentIndex !== -1 && currentIndex < hierarchyConfig.length - 1) {
      return hierarchyConfig[currentIndex + 1] as EntityType;
    }
    
    return null;
  };

  const getEntityTypeLabel = (type: EntityType): string => {
    const labels: Record<EntityType, string> = {
      customer: 'Customer',
      zone: 'Zone',
      nbg: 'NBG',
      ro: 'RO',
      branch: 'Branch',
      device: 'Device'
    };
    return labels[type];
  };

  const handleEntityClick = (entity: Entity) => {
    if (entity.entity_type === 'device') {
      // Show device details modal/page
      console.log('Show device details:', entity);
    } else {
      navigate(`/hierarchy/${entity.id}`);
    }
  };

  const getColumns = () => {
    if (!entities.length) return [];

    const entityType = entities[0].entity_type;
    
    const baseColumns = [
      {
        key: 'entity_name',
        label: `${getEntityTypeLabel(entityType)} Name`,
        sortable: true,
        render: (value: string, row: Entity) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <EntityIcon type={row.entity_type} className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{getEntityTypeLabel(row.entity_type)}</div>
            </div>
          </div>
        )
      }
    ];

    // Add type-specific columns
    switch (entityType) {
      case 'customer':
        baseColumns.push(
          {
            key: 'metadata.email',
            label: 'Email',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.email || '-'}</span>
          },
          {
            key: 'metadata.country',
            label: 'Country',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.country || '-'}</span>
          },
          {
            key: 'metadata.city',
            label: 'City',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.city || '-'}</span>
          }
        );
        break;
      
      case 'zone':
      case 'nbg':
      case 'ro':
        baseColumns.push(
          {
            key: 'metadata.code',
            label: 'Code',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.code || '-'}</span>
          },
          {
            key: 'metadata.manager',
            label: 'Manager',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.manager || '-'}</span>
          }
        );
        break;
      
      case 'branch':
        baseColumns.push(
          {
            key: 'metadata.code',
            label: 'Code',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.code || '-'}</span>
          },
          {
            key: 'metadata.address',
            label: 'Address',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.address || '-'}</span>
          },
          {
            key: 'metadata.manager',
            label: 'Manager',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.manager || '-'}</span>
          }
        );
        break;
      
      case 'device':
        baseColumns.push(
          {
            key: 'metadata.type',
            label: 'Type',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.type || '-'}</span>
          },
          {
            key: 'metadata.status',
            label: 'Status',
            sortable: true,
            render: (_, row: Entity) => {
              const status = row.metadata.status;
              return (
                <Badge 
                  variant="outline" 
                  className={status === 'online' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}
                >
                  {status}
                </Badge>
              );
            }
          },
          {
            key: 'metadata.ip_address',
            label: 'IP Address',
            sortable: false,
            render: (_, row: Entity) => <span>{row.metadata.ip_address || '-'}</span>
          },
          {
            key: 'metadata.last_active',
            label: 'Last Active',
            sortable: false,
            render: (_, row: Entity) => {
              const lastActive = row.metadata.last_active;
              return <span>{lastActive ? new Date(lastActive).toLocaleString() : '-'}</span>;
            }
          }
        );
        break;
    }

    // Add actions column
    baseColumns.push({
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row: Entity) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEntityClick(row);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit:', row);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete:', row);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    });

    return baseColumns;
  };

  const filteredEntities = entities.filter(entity =>
    entity.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.metadata.code && entity.metadata.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPageTitle = () => {
    if (!currentEntity) return 'Customer Management';
    
    const nextType = getNextEntityType(currentEntity.entity_type);
    if (nextType) {
      return `${getEntityTypeLabel(nextType)}s`;
    }
    return 'Devices';
  };

  const getAddButtonText = () => {
    if (!currentEntity) return 'Add Customer';
    
    const nextType = getNextEntityType(currentEntity.entity_type);
    if (nextType) {
      return `Add ${getEntityTypeLabel(nextType)}`;
    }
    return 'Add Device';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <Card className="p-4 bg-gradient-card border-0">
          <Breadcrumb items={breadcrumbs} />
        </Card>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {currentEntity 
              ? `Manage ${currentEntity.entity_name} hierarchy` 
              : 'Manage banking customers and their infrastructure'
            }
          </p>
        </div>
        
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          {getAddButtonText()}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable 
        columns={getColumns()}
        data={filteredEntities}
        searchPlaceholder="Search entities..."
        onRowClick={handleEntityClick}
      />
    </div>
  );
};

export default HierarchyPage;