'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/sidebar';
import ContentPanel from '@/components/admin/contentPanel';

export default function AdminDashboard() {
  console.log('Admin Panel Loaded');
  const [activeCategory, setActiveCategory] = useState('destinations');

  return (
    <div className="flex h-[100dvh]">
      <Sidebar current={activeCategory} onSelect={setActiveCategory} />
      <ContentPanel active={activeCategory} />
    </div>
  );
}
