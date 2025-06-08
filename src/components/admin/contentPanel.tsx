'use client';

import dynamic from 'next/dynamic';

const AdminDestinations = dynamic(() => import('./destinations/adminDestinations'));
const AdminHomestays = dynamic(() => import('./homestays/adminHomestays'));
const AdminEvents = dynamic(() => import('./events/adminEvents'));
const AdminThrills = dynamic(() => import('./thrills/adminThrills'));

interface Props {
  active: string;
}

export default function ContentPanel({ active }: Props) {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {active === 'destinations' && <AdminDestinations />}
      {active === 'homestays' && <AdminHomestays />}
      {active === 'events' && <AdminEvents />}
      {active === 'thrills' && <AdminThrills />}
    </div>
  );
}
