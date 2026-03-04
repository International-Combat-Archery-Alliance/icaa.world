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
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDonationsByState } from '@/hooks/useDonation';
import { formatMoney } from '@/api/money';

type AggregationItem = {
  count: number;
  country: string;
  state: string;
  money: {
    amount: number;
    currency: string;
  };
};

export function DonationByState() {
  const { data, isLoading } = useGetDonationsByState();

  const aggregations: AggregationItem[] = data?.aggregations || [];

  // Group by country for display
  const groupedByCountry = React.useMemo(() => {
    const grouped: Record<string, AggregationItem[]> = {};
    aggregations.forEach((item) => {
      if (!grouped[item.country]) {
        grouped[item.country] = [];
      }
      grouped[item.country].push(item);
    });
    return grouped;
  }, [aggregations]);

  // Calculate totals per country
  const countryTotals = React.useMemo(() => {
    const totals: Record<
      string,
      { count: number; byCurrency: Record<string, number> }
    > = {};
    Object.entries(groupedByCountry).forEach(([country, items]) => {
      totals[country] = { count: 0, byCurrency: {} };
      items.forEach((item) => {
        totals[country].count += item.count;
        if (!totals[country].byCurrency[item.money.currency]) {
          totals[country].byCurrency[item.money.currency] = 0;
        }
        totals[country].byCurrency[item.money.currency] += item.money.amount;
      });
    });
    return totals;
  }, [groupedByCountry]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donations by Location</CardTitle>
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
        <CardTitle>Donations by Location</CardTitle>
      </CardHeader>
      <CardContent>
        {aggregations.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No donation data available
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByCountry).map(([country, items]) => (
              <div key={country}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{country}</h3>
                  <div className="text-sm text-muted-foreground">
                    {countryTotals[country].count} donations |{' '}
                    {Object.entries(countryTotals[country].byCurrency).map(
                      ([currency, amount]) => (
                        <span key={currency} className="ml-1">
                          {formatMoney({ amount, currency })}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>State/Province</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow
                          key={`${item.country}-${item.state}-${index}`}
                        >
                          <TableCell>{item.state}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell>
                            {formatMoney({
                              amount: item.money.amount,
                              currency: item.money.currency,
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
