import React from 'react';
import { Link } from 'react-router-dom';

const NewsItem3 = () => {
    return (
        <section id="news-item-3" className="content-section news-page">
            <Link to="/" className="back-btn">← Back to Home</Link>
            <h2 className="section-title">Boston International Championship: Recap and Results</h2>
            <div className="content-wrapper">
                <p>Full article with a recap and results from the tournament will be displayed here.</p>
            </div>
        </section>
    );
};

export default NewsItem3;
