import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';

const NewsItem3 = () => {
  useTitle('Tournament Results - ICAA News');

  return (
    <section id="news-item-3" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper">
        <p>
          Full article with a recap and results from the tournament will be
          displayed here.
        </p>
      </div>
    </section>
  );
};

export default NewsItem3;
