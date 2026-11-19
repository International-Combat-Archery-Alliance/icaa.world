import { useMutation } from '@tanstack/react-query';
import { signupForMailingListMutation } from '@/api/mailing-list/@tanstack/react-query.gen';

export function useSignupForMailingList() {
  return useMutation(signupForMailingListMutation());
}
