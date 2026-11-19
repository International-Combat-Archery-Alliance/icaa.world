import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const OfficialRules = () => {
  useTitle('Official Rules - ICAA');

  return (
    <section id="official-rules" className="content-section rules-page">
      <div className="content-wrapper mx-auto max-w-screen-lg py-4 sm:px-4 md:px-6">
        <div className="mb-4">
          <Button asChild>
            <Link to="/about-sport">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to About the Sport
            </Link>
          </Button>
        </div>
        <iframe
          src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://assets.icaa.world/8e3e50ec-4c99-4d30-8273-234f0eef8914.pdf"
          title="Official Combat Archery Rules"
          width="100%"
          height="750"
          className="border-0 bg-white"
          // oxlint-disable-next-line react/iframe-missing-sandbox
          sandbox="allow-scripts allow-same-origin allow-popups"
        >
          <Skeleton className="h-[750px] w-full rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default OfficialRules;
