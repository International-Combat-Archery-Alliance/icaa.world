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
  const { userInfo, isSuccess } = useUserInfo();

  return (
    <ProtectedRoute
      isAuthenticated={
        isSuccess && (userInfo?.roles.includes('ADMIN') ?? false)
      }
      redirectTo={redirectTo}
    >
      <>{children}</>
    </ProtectedRoute>
  );
}
