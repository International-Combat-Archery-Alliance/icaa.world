import { useLoginUserInfo } from '@/hooks/useLogin';
import ProtectedRoute from './ProtectedRoute';

export interface AdminOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AdminOnlyRoute({
  children,
  redirectTo = '/',
}: AdminOnlyRouteProps) {
  const { data } = useLoginUserInfo();

  return (
    <ProtectedRoute
      isAuthenticated={data?.isAdmin ?? false}
      redirectTo={redirectTo}
    >
      <>{children}</>
    </ProtectedRoute>
  );
}
