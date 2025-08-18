import { Link } from 'react-router-dom';

const Events = () => {
    return (
        <section id="events-section" className="content-section events-section">
            <h2 className="section-title">Events</h2>
            <div className="content-wrapper">
                <Link to="/event-registration" className="event-register-btn-top">Register for an Event</Link>
                <div className="event-grid">
                    <Link to="/events/catch-2025" data-event="catch-2025" className="event-card">
                        <img src="images/logos/catch 2025.png" alt="C.A.T.C.H. 2025 Logo" className="event-logo" />
                        <h3>C.A.T.C.H 2025</h3>
                        <p>Somerville, MA</p>
                        <p>June 18th, 2025</p>
                    </Link>

                    <Link to="/events/boston-play-ins" data-event="boston-play-ins" className="event-card">
                        <img src="images/logos/boston 2025.png" alt="Boston International Championship Logo" className="event-logo" />
                        <h3>Boston Play In Tournament</h3>
                        <p>Archery Games Boston, Chelsea, MA</p>
                        <p>September 6th, 2025</p>
                    </Link>

                    <Link to="/events/boston-championship" data-event="boston-championship" className="event-card">
                        <img src="images/logos/boston 2025.png" alt="Boston International Championship Logo" className="event-logo" />
                        <h3>Boston International Championship</h3>
                        <p>Archery Games Boston, Chelsea, MA</p>
                        <p>October 25th, 2025</p>
                    </Link>

                    <Link to="/events/catch-2026" data-event="catch-2026" className="event-card">
                        <img src="images/logos/catch 2026.png" alt="C.A.T.C.H. 2026 Logo" className="event-logo" />
                        <h3>C.A.T.C.H. 2026</h3>
                        <p>Location TBD</p>
                        <p>Date TBD</p>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Events;
