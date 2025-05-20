
import React from 'react';
import USPCard from './USPCard';
import { USP, BusinessInfo } from '@/contexts/MarketingToolContext';

interface USPListProps {
  usps: USP[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  business: BusinessInfo;
}

const USPList: React.FC<USPListProps> = ({ usps, onEdit, onDelete, business }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {usps.map((usp) => (
        <USPCard
          key={usp.id}
          usp={usp}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default USPList;
