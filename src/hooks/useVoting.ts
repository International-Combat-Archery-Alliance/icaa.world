import { useQueryClient } from '@tanstack/react-query';
import { useVotingQueryClient } from '../context/votingQueryClientContext';
import type { components, paths } from '@/api/voting-v1';

export type Poll = components['schemas']['Poll'];
export type PollResults = components['schemas']['PollResults'];
export type VoteBallot = components['schemas']['VoteBallot'];
export type PublicResultsLevel = components['schemas']['PublicResultsLevel'];

export function useGetPolls(limit: number = 10) {
  const client = useVotingQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/voting/v1/polls',
    {
      params: {
        query: {
          limit,
          cursor: undefined,
        },
      },
    },
    {
      getNextPageParam: (
        lastPage: paths['/voting/v1/polls']['get']['responses']['200']['content']['application/json'],
      ) => lastPage.cursor,
      initialPageParam: null as string | null,
    },
  );
}

export function useGetPoll(pollId: string | undefined) {
  const client = useVotingQueryClient();

  return client.useQuery(
    'get',
    '/voting/v1/polls/{id}',
    {
      params: {
        path: { id: pollId! },
      },
    },
    { enabled: !!pollId },
  );
}

export function useGetPollResults(pollId: string | undefined) {
  const client = useVotingQueryClient();

  return client.useQuery(
    'get',
    '/voting/v1/polls/{id}/results',
    {
      credentials: 'include',
      params: {
        path: { id: pollId! },
      },
    },
    { enabled: !!pollId },
  );
}

export function useVoteOnPoll() {
  const client = useVotingQueryClient();

  return client.useMutation('post', '/voting/v1/polls/{id}/votes');
}

export function useCreatePoll() {
  const client = useVotingQueryClient();

  return client.useMutation('post', '/voting/v1/polls', {
    credentials: 'include',
  });
}

export function useUpdatePoll() {
  const client = useVotingQueryClient();

  return client.useMutation('patch', '/voting/v1/polls/{id}', {
    credentials: 'include',
  });
}

export function useDeletePoll() {
  const client = useVotingQueryClient();

  return client.useMutation('delete', '/voting/v1/polls/{id}', {
    credentials: 'include',
  });
}

type PollsInfiniteData = {
  pageParams: (string | null)[];
  pages: paths['/voting/v1/polls']['get']['responses']['200']['content']['application/json'][];
};

export function useUpdatePollDataAfterMutate() {
  const tanstackClient = useQueryClient();

  return (poll: Poll) => {
    tanstackClient.setQueryData(
      ['get', '/voting/v1/polls/{id}', { params: { path: { id: poll.id } } }],
      { poll },
    );

    tanstackClient.setQueryData(
      [
        'get',
        '/voting/v1/polls',
        { params: { query: { limit: 10, cursor: undefined } } },
      ],
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
