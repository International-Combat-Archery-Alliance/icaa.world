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
      <div className="content-wrapper mx-auto max-w-screen-lg py-4 sm:px-4 md:px-6">
        <iframe
          src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://assets.icaa.world/8e3e50ec-4c99-4d30-8273-234f0eef8914.pdf"
          title="Official Combat Archery Rules"
          width="100%"
          height="750"
          className="border-0 bg-white"
          sandbox="allow-scripts allow-popups"
        >
          <Skeleton className="h-[750px] w-full rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default OfficialRules;
