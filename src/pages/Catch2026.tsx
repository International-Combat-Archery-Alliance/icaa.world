import React from 'react';
import { Link } from 'react-router-dom';

const Catch2026 = () => {
    return (
        <section id="catch-2026" className="content-section event-page">
            <Link to="/events" className="back-btn">← Back to Events</Link>
            <h2 className="section-title">C.A.T.C.H. 2026</h2>
            <div className="content-wrapper">
                <img src="images/logos/catch 2026.png" className="event-page-logo" />
                <h2>Event Details</h2>
                <p><strong>Date:</strong> June 2026</p>
                <p><strong>Location:</strong> Location TBD</p>
                <p>Details about the C.A.T.C.H. 2026 tournament will be posted here as they become available.</p>
            </div>
            <Link to="/event-registration" className="event-register-btn-top">Register for this Event</Link>
        </section>
    );
};

export default Catch2026;
