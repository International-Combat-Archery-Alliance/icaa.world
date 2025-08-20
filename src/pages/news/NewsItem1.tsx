import { Link } from 'react-router-dom';

const NewsItem1 = () => {
  return (
    <section id="news-item-1" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <h2 className="section-title">
        ICAA Partners with Top Combat Archery Gear Company
      </h2>
      <div className="content-wrapper">
        <p>Full article about the new partnership will be displayed here.</p>
      </div>
    </section>
  );
};

export default NewsItem1;
