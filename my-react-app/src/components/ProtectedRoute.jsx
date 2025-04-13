import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (!storedUser?.token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;