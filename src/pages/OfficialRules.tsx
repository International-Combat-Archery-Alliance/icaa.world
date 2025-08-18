import React from 'react';
import { Link } from 'react-router-dom';

const OfficialRules = () => {
    return (
        <section id="official-rules" className="content-section rules-page">
            <Link to="/about-sport" className="back-btn">← Back to About the Sport</Link>
            <h2 className="section-title">Official Rules</h2>
            <div className="content-wrapper">
                <iframe src="https://docs.google.com/document/d/1DsiUtnoZP-xqftqtjGLf3rEP-6QpQr2M0NuTydMH-gE/preview"
                    style={{ width: '100%', height: '750px', border: 0 }}>
                </iframe>
            </div>
        </section>
    );
};

export default OfficialRules;
