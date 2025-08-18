import { Link } from 'react-router-dom';

const BostonPlayIns = () => {
    return (
        <section id="boston-play-ins" className="content-section event-page">
            <Link to="/events" className="back-btn">← Back to Events</Link>
            <h2 className="section-title">Boston Play Ins Tournament</h2>
            <div className="content-wrapper">
                <img src="/images/logos/boston 2025.png" className="event-page-logo" />
                <h2>Event Details</h2>
                <p><strong>Date:</strong> September 6th, 2025</p>
                <p><strong>Location:</strong> Archery Games Boston, Chelsea, MA</p>
                <p>Details about the Boston Play Ins Tournament will be posted here.</p>
            </div>
            <Link to="/event-registration" className="event-register-btn-top">Register for this Event</Link>
        </section>
    );
};

export default BostonPlayIns;
