import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const OfficialRules = () => {
  return (
    <section id="official-rules" className="content-section rules-page">
      <Link to="/about-sport" className="back-btn">
        ← Back to About the Sport
      </Link>
      <div className="content-wrapper">
        <iframe
          src="https://docs.google.com/document/d/1UQARbdHDrR-kp2McV8XVorGUNOv5apeYAGWnvZlbQaY/preview"
          style={{ width: '100%', height: '750px', border: 0 }}
        >
          <Skeleton className="h-[285px] w-full md:max-w-[375px] rounded-xl" />
        </iframe>
      </div>
    </section>
  );
};

export default OfficialRules;
