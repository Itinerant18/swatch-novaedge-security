import React from 'react';
import RecursiveHierarchyTable from '@/components/RecursiveHierarchyTable';
import { useAuth } from '@/hooks/useAuth';

const CustomersPage: React.FC = () => {
  const { isSuperAdmin, user } = useAuth();

  if (!isSuperAdmin()) {
    // Redirect customer users to their hierarchy
    return (
      <RecursiveHierarchyTable 
        customerId={user?.customerId}
        entityType="customer"
        readOnly={false}
      />
    );
  }

  // Super Admin view - shows all customers
  return (
    <RecursiveHierarchyTable 
      entityType="customer"
      readOnly={false}
    />
  );
};

export default CustomersPage;