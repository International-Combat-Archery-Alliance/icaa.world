import { useVotingQueryClient } from '../context/votingQueryClientContext';
import type { components } from '@/api/voting-v1';

export type Poll = components['schemas']['Poll'];
export type PollResults = components['schemas']['PollResults'];
export type VoteBallot = components['schemas']['VoteBallot'];

export function useGetPolls(limit: number = 50) {
  const client = useVotingQueryClient();

  return client.useQuery('get', '/voting/v1/polls', {
    params: {
      query: {
        limit,
      },
    },
  });
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
