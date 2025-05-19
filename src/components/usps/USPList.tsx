
import React from 'react';
import { USP } from '@/contexts/MarketingToolContext';
import USPCard from './USPCard';

interface USPListProps {
  usps: USP[];
  business: any;
}

const USPList: React.FC<USPListProps> = ({ usps, business }) => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      {usps.map((usp) => (
        <USPCard key={usp.id} usp={usp} business={business} />
      ))}
    </div>
  );
};

export default USPList;
