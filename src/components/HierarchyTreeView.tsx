import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import EntityIcon from './EntityIcon';
import { Entity, EntityType } from '@/types/hierarchy';

interface HierarchyNode extends Entity {
  children?: HierarchyNode[];
  childCount?: number;
  level?: number;
}

interface HierarchyTreeViewProps {
  hierarchyData: HierarchyNode[];
  selectedNode: HierarchyNode | null;
  onNodeSelect: (node: HierarchyNode) => void;
  onNodeAction: (action: 'add' | 'edit' | 'delete', node: HierarchyNode) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loading?: boolean;
}

const HierarchyTreeNode: React.FC<{
  node: HierarchyNode;
  selectedNode: HierarchyNode | null;
  onNodeSelect: (node: HierarchyNode) => void;
  onNodeAction: (action: 'add' | 'edit' | 'delete', node: HierarchyNode) => void;
  level?: number;
  searchTerm: string;
}> = ({ node, selectedNode, onNodeSelect, onNodeAction, level = 0, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode?.id === node.id;
  
  // Filter children based on search
  const filteredChildren = node.children?.filter(child => 
    searchTerm === '' || 
    child.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.children?.some(grandchild => 
      grandchild.entity_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const shouldShow = searchTerm === '' || 
    node.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filteredChildren.length > 0;

  if (!shouldShow) return null;

  const getNodeStats = (node: HierarchyNode) => {
    if (node.entity_type === 'device') {
      return (
        <Badge variant={node.metadata?.status === 'online' ? 'default' : 'secondary'} className="text-xs">
          {node.metadata?.status || 'offline'}
        </Badge>
      );
    }
    
    if (node.childCount) {
      return (
        <Badge variant="outline" className="text-xs">
          {node.childCount} {node.entity_type === 'customer' ? 'zones' : 
           node.entity_type === 'zone' ? 'branches' : 
           node.entity_type === 'branch' ? 'devices' : 'items'}
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="select-none">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={`flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors group ${
            isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''
          }`}
          style={{ paddingLeft: `${(level * 16) + 12}px` }}
          onClick={() => onNodeSelect(node)}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                {isOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          
          {!hasChildren && <div className="w-4" />}
          
          <EntityIcon type={node.entity_type as EntityType} className="w-4 h-4 text-muted-foreground" />
          
          <div className="flex-1 flex items-center justify-between min-w-0">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-foreground truncate">
                {node.entity_name}
              </div>
              {node.metadata?.type && (
                <div className="text-xs text-muted-foreground">
                  {node.metadata.type}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {getNodeStats(node)}
              
              <div className="hidden group-hover:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeAction('add', node);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeAction('edit', node);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeAction('delete', node);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {hasChildren && (
          <CollapsibleContent className="space-y-0">
            {filteredChildren.map((child) => (
              <HierarchyTreeNode
                key={child.id}
                node={child}
                selectedNode={selectedNode}
                onNodeSelect={onNodeSelect}
                onNodeAction={onNodeAction}
                level={level + 1}
                searchTerm={searchTerm}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

const HierarchyTreeView: React.FC<HierarchyTreeViewProps> = ({
  hierarchyData,
  selectedNode,
  onNodeSelect,
  onNodeAction,
  searchTerm,
  onSearchChange,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers, zones, branches..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {hierarchyData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-sm">No customers found</div>
              <div className="text-xs">Add your first customer to get started</div>
            </div>
          ) : (
            hierarchyData.map((node) => (
              <HierarchyTreeNode
                key={node.id}
                node={node}
                selectedNode={selectedNode}
                onNodeSelect={onNodeSelect}
                onNodeAction={onNodeAction}
                searchTerm={searchTerm}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HierarchyTreeView;