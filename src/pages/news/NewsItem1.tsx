import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NewsItem1 = () => {
  return (
    <section id="news-item-1" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-balance">
            ICAA Announces Official Launch with Inaugural Boston Play Ins
            Tournament
          </h1>
          <p className="text-sm text-muted-foreground">August 1, 2024</p>
        </header>

        <img
          src="/images/logos/thumb_Boston Play in.jpg"
          alt="Boston 2025 Tournament Logo"
          className="w-full max-w-sm mx-auto rounded-lg mb-8"
        />

        <div className="flex flex-col gap-6 text-lg text-justify">
          <p>
            The International Combat Archery Alliance (ICAA) is proud to
            announce its official launch with the first-ever Boston Play Ins
            Tournament this fall. The ICAA is a global coalition of athletes,
            organizers, and enthusiasts dedicated to advancing combat archery: a
            dynamic sport that combines the fast-paced, elimination-style
            intensity of dodgeball with the precision and skill of archery.
            Combat archery is as thrilling to watch as it is to play! Teams
            square off in high-energy matches where every arrow counts,
            requiring technical skill under pressure, split-second strategic
            decisions, and the athleticism to dodge, dive, and even catch arrows
            mid-flight. With a vision to grow combat archery into a recognized
            and accessible sport worldwide, the ICAA is building opportunities
            for athletes through competitive leagues, international tournaments,
            and community events.
          </p>

          <p>
            The excitement begins with the{' '}
            <span className="font-semibold">2025 Boston Play Ins</span>, held at
            Archery Games Boston in Chelsea, MA, on Saturday, September 6th. Over
            the course of four hours, five Boston-based
            teams will battle for just three coveted qualifying spots in next
            month’s international competition, which will feature top teams from
            all around North America. The Play Ins promise a day packed with
            fast-paced action, fierce rivalries, and community spirit,
            showcasing the best combat archers in the Boston area. Whether
            you’re a seasoned player, a sports enthusiast looking for something
            new, or simply curious to witness the adrenaline of arrows flying in
            live competition, this event is the perfect introduction to the
            world of combat archery. Come join the community, cheer on the
            athletes, and be part of the ICAA’s historic first step onto the
            global stage.
          </p>
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

export default NewsItem1;
