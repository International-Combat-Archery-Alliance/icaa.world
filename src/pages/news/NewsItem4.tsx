import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NewsItem4 = () => {
  useTitle('Registration Open for Boston Championships 2025 - ICAA News');

  return (
    <section id="news-item-4" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-balance">
            Registration is Now Open for the Boston Championships 2025!
          </h1>
          <p className="text-sm text-muted-foreground">September 20, 2025</p>
        </header>

        <img
          src="/images/logos/Boston_Championship.png"
          alt="Boston Championships 2025 Logo"
          className="w-78 mx-auto rounded-lg mb-8"
        />

        <div className="flex flex-col gap-6 text-lg text-justify">
          <p>
            The moment has arrived! Registration for the highly anticipated
            Boston Championships 2025 is officially open. Following the
            thrilling conclusion of the local Play-Ins, the stage is now set for
            the main event where top teams from across North America will
            converge to battle for the title of ICAA Champion on October 25th at
            Archery Games Boston, in Chealsea MA.
          </p>
          <p>
            This premier tournament will showcase the highest level of combat
            archery, featuring intense strategy, incredible athleticism, and the
            unparalleled excitement that defines our sport. Whether you are a
            team ready to prove you are the best or a skilled free agent looking
            to join a squad, now is your chance to be part of the action.
          </p>
          <p>
            Spots are limited, so assemble your team, sharpen your skills, and
            head over to the events page to secure your place in what promises
            to be an unforgettable competition. Do not miss your opportunity to
            compete against the elite and make your mark on the international
            stage!
          </p>
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="text-lg">
            <Link to="/events">Register Now!</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsItem4;
