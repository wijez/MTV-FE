import React from 'react';
import Pagination from '@mui/material/Pagination';

export default function ReusablePagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; 

  return (
    <div className="flex justify-center mt-4">
      <Pagination
        count={totalPages}
        page={currentPage} 
        onChange={onPageChange} 
        color="primary"
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
}