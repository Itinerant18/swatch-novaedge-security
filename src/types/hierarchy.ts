// Dynamic hierarchy types for the banking system

export interface Entity {
  id: string;
  entity_type: 'customer' | 'zone' | 'nbg' | 'ro' | 'branch' | 'device';
  entity_name: string;
  parent_id: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface HierarchyConfig {
  id: string;
  customer_id: string;
  hierarchy_levels: string[];
  created_at: string;
  updated_at: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface EntityTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: Entity) => React.ReactNode;
}

export type EntityType = 'customer' | 'zone' | 'nbg' | 'ro' | 'branch' | 'device';