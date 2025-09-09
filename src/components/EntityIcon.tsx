import React from 'react';
import { Building2, Map, Building, Users, Server, Monitor } from 'lucide-react';
import { EntityType } from '@/types/hierarchy';

interface EntityIconProps {
  type: EntityType;
  className?: string;
}

const EntityIcon: React.FC<EntityIconProps> = ({ type, className = 'w-4 h-4' }) => {
  const iconProps = { className };

  switch (type) {
    case 'customer':
      return <Building2 {...iconProps} />;
    case 'zone':
      return <Map {...iconProps} />;
    case 'nbg':
      return <Building {...iconProps} />;
    case 'ro':
      return <Users {...iconProps} />;
    case 'branch':
      return <Building {...iconProps} />;
    case 'device':
      return <Monitor {...iconProps} />;
    default:
      return <Server {...iconProps} />;
  }
};

export default EntityIcon;