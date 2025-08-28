import { useLoginQueryClient } from '@/context/loginQueryClientContext';

export default function useLogin() {
  const client = useLoginQueryClient();

  return client.useMutation('post', '/login/google');
}
