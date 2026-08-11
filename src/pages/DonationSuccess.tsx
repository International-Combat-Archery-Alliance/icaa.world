import { useTitle } from 'react-use';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function DonationSuccess() {
  useTitle('Thank You for Your Donation - ICAA');

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Heart className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Thank You for Your Support!
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 text-center">
          <p className="text-gray-600">
            Your donation to the International Combat Archery Alliance has been
            received. Your generosity helps us grow the sport worldwide and
            support our community programs.
          </p>
          <p className="text-gray-600">
            A receipt has been sent to your email address.
          </p>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="mb-2 font-medium text-blue-800">Stay Connected!</p>
            <p className="mb-3 text-sm text-blue-700">
              Want to receive updates about events, tournaments, and ICAA news?
              Join our mailing list to stay in the loop!
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/mailing-list">Join Our Mailing List</Link>
            </Button>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/events">View Events</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
