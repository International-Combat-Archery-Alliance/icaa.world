import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDonations } from '@/hooks/useDonation';
import { formatMoney } from '@/api/money';
import type { DateRange } from 'react-day-picker';

interface DonationListProps {
  dateRange?: DateRange;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAmount(amount: number, currency: string): string {
  return formatMoney({ amount, currency });
}

export function DonationList({ dateRange }: DonationListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetDonations(20, { from: dateRange?.from, to: dateRange?.to });

  // Flatten all pages into a single array of donations
  const allDonations = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  // Get total count from the first page (if available)
  const totalCount = data?.pages[0]?.totalCount;

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Donations
          {totalCount !== undefined && totalCount !== null && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({totalCount} total)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDonations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No donations found
                  </TableCell>
                </TableRow>
              ) : (
                allDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{formatDate(donation.createdAt)}</TableCell>
                    <TableCell>{donation.donorEmail || 'N/A'}</TableCell>
                    <TableCell>
                      {formatAmount(donation.amount, donation.currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          donation.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {donation.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {donation.billingDetails?.address?.city || 'N/A'}
                      {donation.billingDetails?.address?.state &&
                        `, ${donation.billingDetails.address.state}`}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {hasNextPage && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              variant="outline"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
