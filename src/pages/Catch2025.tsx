import React from 'react';
import { Link } from 'react-router-dom';

const Catch2025 = () => {
    return (
        <section id="catch-2025" className="content-section event-page">
            <Link to="/events" className="back-btn">← Back to Events</Link>
            <h2 className="section-title">C.A.T.C.H 2025</h2>
            <div className="content-wrapper">
                <img src="images/logos/catch 2025.png" className="event-page-logo" />
                <h2>Event Details</h2>
                <p><strong>Date:</strong> June 2025</p>
                <p><strong>Location:</strong> Somerville, MA</p>
                <p>Details about this inaugural event will be posted here.</p>
            </div>
            <Link to="/event-registration" className="event-register-btn-top">Register for this Event</Link>
        </section>
    );
};

export default Catch2025;
