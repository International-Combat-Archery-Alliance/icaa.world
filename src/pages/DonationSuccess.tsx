import { useTitle } from 'react-use';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function DonationSuccess() {
  useTitle('Thank You for Your Donation - ICAA');

  return (
    <div className="px-4 py-8 max-w-screen-lg mx-auto">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Heart className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-center font-bold text-2xl">
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
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-blue-800 font-medium mb-2">Stay Connected!</p>
            <p className="text-blue-700 text-sm mb-3">
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
