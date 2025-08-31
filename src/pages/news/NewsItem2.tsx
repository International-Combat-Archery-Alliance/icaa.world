import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const NewsItem2 = () => {
  useTitle('Official Tournament Rules - ICAA News');

  return (
    <section id="news-item-2" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-balance">
            Rules Announced for Official Tournament Play!
          </h1>
          <p className="text-sm text-muted-foreground">August 30, 2025</p>
        </header>

        <div className="flex flex-col gap-6 text-lg text-justify">
          <p>
            The International Combat Archery Alliance (ICAA) is excited to
            release the official rulebook for competitive tournament play. This
            comprehensive document outlines the standardized regulations that
            will govern all ICAA-sanctioned events, ensuring fair and consistent
            competition for all athletes. This rulebook covers the Tournament
            Gameplay Rules , such as the fundamentals of the game and getting
            hit and catches, to how the neutral zones work. This rulebook does
            not include the specific tournament, match, or round formats as that
            will be specific to each individual event. We encourage all players,
            organizers, and fans to familiarize themselves with these rules as
            we prepare for the upcoming season of combat archery.
          </p>

          <iframe
            src="https://docs.google.com/document/d/e/2PACX-1vTVdQN1TKuKVl7-kmhAAf8ZbHB90Sn3jhUUJovUBioi-H6lcqvkhKiMahgwYipgv0hBEl93ixTMQtFt/pub?embedded=true"
            height="750"
            width="100%"
            className="bg-white border-0"
          >
            <Skeleton className="h-full w-full rounded-xl" />
          </iframe>
          <p>
            For inquiries, please contact{' '}
            <a
              href="mailto:info@icaa.world"
              className="font-semibold text-primary hover:underline"
            >
              info@icaa.world
            </a>
            .
          </p>
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="text-lg">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsItem2;
