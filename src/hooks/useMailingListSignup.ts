import { useMailingListQueryClient } from '@/context/mailingListQueryClientContext';

export function useSignupForMailingList() {
  const client = useMailingListQueryClient();

  return client.useMutation('post', '/mailing-list/signup');
}
