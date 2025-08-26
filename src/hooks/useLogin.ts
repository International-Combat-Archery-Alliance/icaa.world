import { useEventQueryClient } from '@/context/eventQueryClientContext';

export default function useLogin() {
  const client = useEventQueryClient();

  return client.useMutation('post', '/google/login');
}
