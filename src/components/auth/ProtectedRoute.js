import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  // login durumu
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // giriş yapılmamışsa girişe yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // giriş yapılmışsa ender et
  return children;
};

export default ProtectedRoute; 