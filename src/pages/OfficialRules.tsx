import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const OfficialRules = () => {
  useTitle('Official Rules - ICAA');

  return (
    <section id="official-rules" className="content-section rules-page">
      <Link to="/about-sport" className="back-btn">
        ← Back to About the Sport
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto py-4 sm:px-4 md:px-6">
        <iframe
          src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://icaa.world/docs/2000-OFFICIAL_ICAA_GAMEPLAY_RULES.pdf"
          width="100%"
          height="750"
          className="bg-white border-0"
        >
          <Skeleton className="h-[750px] w-full rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default OfficialRules;
