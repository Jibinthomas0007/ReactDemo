import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  
  // If there's no token, redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the protected component
  return <Outlet />;
}

export default ProtectedRoute;