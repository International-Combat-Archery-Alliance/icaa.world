import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NewsItem5 = () => {
  useTitle('Boston Championships 2025 Results - ICAA News');

  return (
    <section id="news-item-5" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-balance">
            Boston Renegades Crowned Champions at the 2025 ICAA Boston
            Championships!
          </h1>
          <p className="text-sm text-muted-foreground">October 26, 2025</p>
        </header>

        <img
          src="/images/other/2025_BC_Results.PNG"
          alt="Boston Championships 2025 Final Standings"
          className="w-full max-w-2xl mx-auto rounded-lg mb-8"
        />

        <div className="flex flex-col gap-6 text-lg text-justify">
          <p>
            The inaugural ICAA Boston Championships have concluded, and after a
            day of intense competition, the Boston Renegades have emerged as the
            undisputed champions! After years of failed attempts, the Boston
            team emerged as the victors over their Canadian rivals. A dominant
            performance during the Round Robin was capped with an incredibly
            close Finals against MTL Originals.
          </p>
          <p>
            The tournament brought together the best teams from across North
            America for a spectacular display of skill, strategy, and
            sportsmanship. MTL Originals fought valiantly to secure a
            second-place finish, while Casual Tease from Ottawa rounded out the
            podium in third. Congratulations to the Boston Renegades on their
            historic win and to all the teams for an unforgettable tournament!
          </p>
        </div>
        <img
          src="/images/Rotating Archery Photos/67.jpg"
          alt="Winning team celebrating"
          className="w-full max-w-2xl mx-auto rounded-lg my-8"
        />
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="text-lg">
            <Link to="/events/78af69ec-e323-436b-96b6-1b5dc9acf46b/event-details">
              View Full Event Details
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsItem5;
