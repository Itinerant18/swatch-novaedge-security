import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem } from '@/types/hierarchy';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}>
      <Link 
        to="/customers" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Customers
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.name}</span>
          ) : (
            <Link 
              to={item.url}
              className="hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;