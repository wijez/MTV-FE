import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';


export function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('access');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
