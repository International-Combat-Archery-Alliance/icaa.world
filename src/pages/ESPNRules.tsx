import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ESPNRules = () => {
  useTitle('Event Rules - ESPN All Stars 2026 - ICAA');

  return (
    <section id="espn-rules" className="content-section rules-page">
      <Button asChild className="m-4">
        <Link to="/espn">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to ESPN Page
        </Link>
      </Button>
      <div>
        <iframe
          src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://assets.icaa.world/1125fa5b-623c-445b-a991-f9827e7739b6.pdf"
          className="w-full h-[80vh] bg-white border-0"
        >
          <Skeleton className="h-full w-full rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default ESPNRules;
