import React from 'react';
import HeaderPage from '../header';
import HomeAdminLayout from '../Layout/homeAdminLayout';

export default function HomeAdmin() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderPage />
      <div className="flex-1">
        <HomeAdminLayout />
      </div>
    </div>
  );
}