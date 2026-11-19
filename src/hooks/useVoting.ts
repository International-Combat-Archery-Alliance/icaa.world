import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteVotingV1PollsIdMutation,
  getVotingV1PollsIdOptions,
  getVotingV1PollsIdQueryKey,
  getVotingV1PollsIdResultsOptions,
  getVotingV1PollsInfiniteOptions,
  getVotingV1PollsInfiniteQueryKey,
  patchVotingV1PollsIdMutation,
  postVotingV1PollsIdVotesMutation,
  postVotingV1PollsMutation,
} from '@/api/voting/@tanstack/react-query.gen';
import '@/context/votingQueryClientContext';
import type { GetVotingV1PollsResponse, Poll } from '@/api/voting';

export type {
  Poll,
  PollResults,
  PublicResultsLevel,
  VoteBallot,
} from '@/api/voting';

export function useGetPolls(limit: number = 10) {
  return useInfiniteQuery({
    ...getVotingV1PollsInfiniteOptions({ query: { limit } }),
    initialPageParam: { query: { cursor: undefined } },
    getNextPageParam: (lastPage: GetVotingV1PollsResponse) => lastPage.cursor,
  });
}

export function useGetPoll(pollId: string | undefined) {
  return useQuery({
    ...getVotingV1PollsIdOptions({ path: { id: pollId ?? '' } }),
    enabled: !!pollId,
  });
}

export function useGetPollResults(pollId: string | undefined) {
  return useQuery({
    ...getVotingV1PollsIdResultsOptions({ path: { id: pollId ?? '' } }),
    enabled: !!pollId,
    retry(failureCount, error) {
      if (error && typeof error === 'object' && 'code' in error) {
        return error.code === 'InternalError' && failureCount < 3;
      }
      return failureCount < 3;
    },
  });
}

export function useVoteOnPoll() {
  return useMutation(postVotingV1PollsIdVotesMutation());
}

export function useCreatePoll() {
  return useMutation(postVotingV1PollsMutation());
}

export function useUpdatePoll() {
  return useMutation(patchVotingV1PollsIdMutation());
}

export function useDeletePoll() {
  return useMutation(deleteVotingV1PollsIdMutation());
}

type PollsInfiniteData = {
  pageParams: (string | { query: { cursor: string | undefined } })[];
  pages: GetVotingV1PollsResponse[];
};

export function useUpdatePollDataAfterMutate() {
  const tanstackClient = useQueryClient();

  return (poll: Poll) => {
    tanstackClient.setQueryData(
      getVotingV1PollsIdQueryKey({ path: { id: poll.id } }),
      { poll },
    );

    tanstackClient.setQueryData(
      getVotingV1PollsInfiniteQueryKey({ query: { limit: 10 } }),
      (old: PollsInfiniteData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((p) => (p.id === poll.id ? poll : p)),
          })),
        };
      },
    );
  };
}
