import { useLoginQueryClient } from '@/context/loginQueryClientContext';

export function useLogin() {
  const client = useLoginQueryClient();

  return client.useMutation('post', '/login/google');
}

export function useLoginUserInfo() {
  const client = useLoginQueryClient();

  return client.useQuery(
    'get',
    '/login/google/userInfo',
    {
      credentials: 'include',
    },
    {
      retry(_, error) {
        if (error.code === 'AuthError') {
          return false;
        }
        return true;
      },
    },
  );
}

export function useLogout() {
  const client = useLoginQueryClient();

  return client.useMutation('delete', '/login/google');
}
