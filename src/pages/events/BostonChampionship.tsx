import { Link } from 'react-router-dom';

const BostonChampionship = () => {
  return (
    <section id="boston-championship" className="content-section event-page">
      <Link to="/events" className="back-btn">
        ← Back to Events
      </Link>
      <div className="content-wrapper">
        <img src="/images/logos/boston 2025.png" className="event-page-logo" />
        <h2>Event Details</h2>
        <p>
          <strong>Date:</strong> October 25, 2025
        </p>
        <p>
          <strong>Location:</strong> Archery Games Boston, Chelsea, MA
        </p>
        <p>
          Details about the first-ever Boston International Championship will be
          posted here.
        </p>
      </div>
      <Link to="/event-registration" className="event-register-btn-top">
        Register for this Event
      </Link>
    </section>
  );
};

export default BostonChampionship;
