import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const NewsItem3 = () => {
  useTitle('Play-Ins Result - ICAA News');

  return (
    <section id="news-item-3" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-balance">
            First ICAA Event Concludes. Check out the result!
          </h1>
          <p className="text-sm text-muted-foreground">September 7, 2025</p>
        </header>

        <img
          src="/images/logos/thumb_Boston Play in.jpg"
          alt="Boston 2025 Play-In Logo"
          className="w-48 mx-auto rounded-lg mb-8"
        />

        <div className="flex flex-col gap-6 text-lg text-justify">
          <p>
            The inaugural Boston Play-Ins have concluded in a thrilling display
            of combat archery, with three teams emerging to claim their spots in
            the upcoming international tournament. The Boston Renegades
            showcased an absolutely dominant performance, finishing with a
            perfect 6-0 record and not dropping a single round throughout the
            day, securing their first-place finish in decisive fashion. Joining
            them in the international competition will be Draw Blood, who fought
            hard to a 4-2 record, and the Tag Alongs, who battled to a 2-4
            record to clinch the final qualifying spot. While team V fought
            valiantly, they were eliminated after a tough 0-6 day.
            Congratulations to the Renegades, Draw Blood, and Tag Alongs, and we
            look forward to seeing them represent Boston on the international
            stage!
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Net Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Boston Renegades</TableCell>
                <TableCell>6-0</TableCell>
                <TableCell>30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>Draw Blood</TableCell>
                <TableCell>4-2</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>Tag Alongs</TableCell>
                <TableCell>2-4</TableCell>
                <TableCell>-2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>V</TableCell>
                <TableCell>0-6</TableCell>
                <TableCell>-28</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="text-lg">
            <Link to="/events">View Event Details</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsItem3;
