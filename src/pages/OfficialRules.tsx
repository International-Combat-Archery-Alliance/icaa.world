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
      <div className="content-wrapper">
        <iframe
          src="https://docs.google.com/document/d/e/2PACX-1vTVdQN1TKuKVl7-kmhAAf8ZbHB90Sn3jhUUJovUBioi-H6lcqvkhKiMahgwYipgv0hBEl93ixTMQtFt/pub?embedded=true"
          style={{ width: '100%', height: '750px', border: 0 }}
        >
          <Skeleton className="h-[285px] w-full md:max-w-[375px] rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default OfficialRules;
