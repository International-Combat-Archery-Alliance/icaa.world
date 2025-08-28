import ProtectedRoute from './ProtectedRoute';
import { useUserInfo } from '@/context/userInfoContext';

export interface AdminOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AdminOnlyRoute({
  children,
  redirectTo = '/',
}: AdminOnlyRouteProps) {
  const { userInfo } = useUserInfo();

  return (
    <ProtectedRoute
      isAuthenticated={userInfo?.isAdmin ?? false}
      redirectTo={redirectTo}
    >
      <>{children}</>
    </ProtectedRoute>
  );
}
