import { useTitle } from 'react-use';
import { BackButton } from '@/components/BackButton';
import { Skeleton } from '@/components/ui/skeleton';

const ESPNRules = () => {
  useTitle('Event Rules - ESPN All Stars 2026 - ICAA');

  return (
    <section id="espn-rules" className="content-section rules-page">
      <div className="p-4">
        <BackButton to="/espn">Back to ESPN Page</BackButton>
      </div>
      <div>
        <iframe
          src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://assets.icaa.world/1125fa5b-623c-445b-a991-f9827e7739b6.pdf"
          title="ESPN8 Rules"
          className="h-[80vh] w-full border-0 bg-white"
          // oxlint-disable-next-line react/iframe-missing-sandbox
          sandbox="allow-scripts allow-same-origin allow-popups"
        >
          <Skeleton className="h-full w-full rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default ESPNRules;
