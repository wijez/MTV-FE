import React from 'react';
import HeaderPage from '../header';
import ScientificAdminLayout from '../Layout/scientificAdminLayout';

export default function ScientificRequest() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderPage />
      <div className="flex-1 pt-10">
        <ScientificAdminLayout />
      </div>
    </div>
  );
}