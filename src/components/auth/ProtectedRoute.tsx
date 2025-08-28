import { Navigate } from 'react-router-dom';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  isAuthenticated,
  redirectTo = '/',
}: ProtectedRouteProps) {
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
}
