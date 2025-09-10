import React, { useEffect, useState } from 'react';
import { Entity, EntityType, BreadcrumbItem } from '../types/hierarchy';
import { supabase } from '@/integrations/supabase/client';
import HierarchyTreeView from '../components/HierarchyTreeView';
import HierarchyDetailPanel from '../components/HierarchyDetailPanel';
import AddCustomerDialog from '../components/AddCustomerDialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface HierarchyNode extends Entity {
  children?: HierarchyNode[];
  childCount?: number;
  level?: number;
}

const CustomersPage: React.FC = () => {
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);
      
      // Fetch all entities
      const { data: entities, error } = await supabase
        .from('entities')
        .select('*')
        .order('entity_name');

      if (error) throw error;

      // Build hierarchy tree
      const typedEntities = (entities || []).map(item => ({
        ...item,
        entity_type: item.entity_type as EntityType,
        metadata: item.metadata || {},
        parent_id: item.parent_id || null
      }));
      const hierarchy = buildHierarchyTree(typedEntities);
      setHierarchyData(hierarchy);
      
      // Auto-select first customer if none selected
      if (!selectedNode && hierarchy.length > 0) {
        handleNodeSelect(hierarchy[0]);
      }
    } catch (error) {
      console.error('Failed to fetch hierarchy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchyTree = (entities: Entity[]): HierarchyNode[] => {
    const entityMap = new Map<string, HierarchyNode>();
    const rootEntities: HierarchyNode[] = [];

    // Convert entities to nodes and map them
    entities.forEach(entity => {
      const node: HierarchyNode = {
        ...entity,
        children: [],
        childCount: 0,
        level: 0
      };
      entityMap.set(entity.id, node);
    });

    // Build parent-child relationships
    entities.forEach(entity => {
      const node = entityMap.get(entity.id);
      if (!node) return;

      if (entity.parent_id) {
        const parent = entityMap.get(entity.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
          parent.childCount = parent.children.length;
          node.level = (parent.level || 0) + 1;
        }
      } else {
        rootEntities.push(node);
      }
    });

    // Sort children by name
    const sortNodes = (nodes: HierarchyNode[]) => {
      nodes.sort((a, b) => a.entity_name.localeCompare(b.entity_name));
      nodes.forEach(node => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(rootEntities);
    return rootEntities;
  };

  const handleNodeSelect = (node: HierarchyNode) => {
    setSelectedNode(node);
    setBreadcrumbs(buildBreadcrumbs(node));
  };

  const buildBreadcrumbs = (node: HierarchyNode): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    let current: HierarchyNode | null = node;
    
    // Find path to root
    const path: HierarchyNode[] = [current];
    while (current?.parent_id) {
      const parent = findNodeById(hierarchyData, current.parent_id);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }
    
    // Build breadcrumb items
    path.forEach((pathNode, index) => {
      breadcrumbs.push({
        id: pathNode.id,
        name: pathNode.entity_name,
        type: pathNode.entity_type,
        url: `/customers/${pathNode.id}`
      });
    });
    
    return breadcrumbs;
  };

  const findNodeById = (nodes: HierarchyNode[], id: string): HierarchyNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleNodeAction = (action: 'add' | 'edit' | 'delete', node: HierarchyNode) => {
    console.log(`Action ${action} on node:`, node.entity_name);
    // Implement actions: open dialogs, perform operations
    switch (action) {
      case 'add':
        // Open add entity dialog
        break;
      case 'edit':
        // Open edit entity dialog
        break;
      case 'delete':
        // Show confirmation and delete
        break;
    }
  };

  const handleCustomerAdded = () => {
    fetchHierarchyData();
  };

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Hierarchy Explorer</h1>
          <p className="text-muted-foreground">Navigate through dynamic customer hierarchies and manage entities</p>
        </div>
        
        <AddCustomerDialog onCustomerAdded={handleCustomerAdded} />
      </div>

      {/* Main Content - Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Tree View */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
            <div className="h-full border-r border-border bg-muted/30">
              <HierarchyTreeView
                hierarchyData={hierarchyData}
                selectedNode={selectedNode}
                onNodeSelect={handleNodeSelect}
                onNodeAction={handleNodeAction}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                loading={loading}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Detail View */}
          <ResizablePanel defaultSize={70}>
            <HierarchyDetailPanel
              selectedNode={selectedNode}
              breadcrumbs={breadcrumbs}
              onNodeAction={handleNodeAction}
              loading={loading}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CustomersPage;