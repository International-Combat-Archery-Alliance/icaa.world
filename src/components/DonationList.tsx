import * as React from 'react';
import { useState } from 'react';
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
import type { components } from '@/api/donations-v1';

type DonationItem = components['schemas']['DonationItem'];

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

export function DonationList() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allDonations, setAllDonations] = useState<DonationItem[]>([]);

  const { data, isLoading, isFetching } = useGetDonations({
    limit: 20,
    cursor,
  });

  // Append new donations to the list when data changes
  React.useEffect(() => {
    if (data?.items) {
      setAllDonations((prev) => {
        const newItems = data.items.filter(
          (item) => !prev.some((p) => p.id === item.id),
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  const handleLoadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  const hasMore = data?.nextCursor !== null && data?.nextCursor !== undefined;

  if (isLoading && allDonations.length === 0) {
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
          {data?.totalCount !== undefined && data?.totalCount !== null && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({data.totalCount} total)
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

        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleLoadMore}
              disabled={isFetching}
              variant="outline"
            >
              {isFetching ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
