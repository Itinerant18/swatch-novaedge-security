import React from 'react';
import { useParams } from 'react-router-dom';
import RecursiveHierarchyTable from '@/components/RecursiveHierarchyTable';
import { useAuth } from '@/hooks/useAuth';

const HierarchyPage: React.FC = () => {
  const { entityId } = useParams<{ entityId?: string }>();
  const { user, isSuperAdmin } = useAuth();

  return (
    <RecursiveHierarchyTable 
      entityId={entityId}
      customerId={!isSuperAdmin() ? user?.customerId : undefined}
      readOnly={false}
    />
  );
};

export default HierarchyPage;