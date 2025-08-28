import { useLoginQueryClient } from '@/context/loginQueryClientContext';

export function useLogin() {
  const client = useLoginQueryClient();

  return client.useMutation('post', '/login/google');
}

export function useLoginUserInfo() {
  const client = useLoginQueryClient();

  return client.useQuery('get', '/login/google/userInfo', {
    credentials: 'include',
  });
}
