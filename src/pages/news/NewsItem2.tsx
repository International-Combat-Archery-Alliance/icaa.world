import { Link } from 'react-router-dom';

const NewsItem2 = () => {
  return (
    <section id="news-item-2" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper">
        <p>
          Full article about the upcoming rule changes will be displayed here.
        </p>
      </div>
    </section>
  );
};

export default NewsItem2;
