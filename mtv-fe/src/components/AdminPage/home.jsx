import React from 'react';
import HomeAdminLayout from '../Layout/homeAdminLayout';
import Menu from '../menu';
import HeaderAdmin from '../headeradmin';

export default function HomeAdmin() {
  return (
   <div className="flex h-screen">
      {/* Menu (2/10 chiều rộng) */}
      <div className="w-1/5 bg-white overflow-hidden">
        <Menu />
      </div>

      {/* Header và Nội dung chính (8/10 chiều rộng) */}
      <div className="w-4/5 flex flex-col">
        {/* Header */}
        <HeaderAdmin/>

        {/* Nội dung chính */}
        <div className="flex-1">
          <HomeAdminLayout />
        </div>
      </div>
    </div>
  );
}