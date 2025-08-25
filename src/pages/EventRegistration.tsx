import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

const EventRegistration = () => {
  const [registrationType, setRegistrationType] = useState('');
  // Initialize state for 8 players in the roster
  const [roster, setRoster] = useState(
    Array.from({ length: 8 }, () => ({ name: '' })),
  );
  const [experienceLevel, setExperienceLevel] = useState('');

  const handleRosterChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const playerToUpdate = roster[index];

    // This check ensures we don't try to modify an undefined array element.
    if (playerToUpdate) {
      playerToUpdate.name = event.target.value;
      setRoster(roster);
    }
    setRoster(roster);
  };

  return (
    <section
      id="event-registration"
      className="content-section event-registration-section"
    >
      <Link to="/events" className="back-btn">
        ← Back to Events
      </Link>
      <h2 className="section-title">Event Registration</h2>
      <div className="content-wrapper">
        <form id="event-registration-form" className="event-registration-form">
          <label htmlFor="event-select">Event Name *</label>
          <select id="event-select" name="event_name" required>
            <option value="">-- Select an Event --</option>
            <option value="catch-2025">C.A.T.C.H 2025</option>
            <option value="boston-play-ins">Boston Play In Tournament</option>
            <option value="boston-championship">
              Boston International Championship
            </option>
            <option value="catch-2026">C.A.T.C.H. 2026</option>
          </select>

          <label htmlFor="registration-type">Registration Type *</label>
          <select
            id="registration-type"
            name="registration_type"
            required
            value={registrationType}
            onChange={(e) => setRegistrationType(e.target.value)}
          >
            <option value="">-- Select a Type --</option>
            <option value="team">Team Registration</option>
            <option value="free-agent">Free Agent</option>
          </select>

          {registrationType === 'team' && (
            <div id="team-fields" className="form-group">
              <label htmlFor="team-name">Team Name *</label>
              <input type="text" id="team-name" name="team_name" />
              <span className="error-message">This field is required</span>

              <label htmlFor="team-email">Captain&apos;s Email *</label>
              <input type="text" id="team-email" name="team-email" />
              <span className="error-message">This field is required</span>

              <label htmlFor="team-city">Home City *</label>
              <input type="text" id="team-city" name="team_city" />
              <span className="error-message">This field is required</span>

              <label>Roster (6-8 Players) *</label>
              <div className="roster-table" id="roster-fields">
                {roster.map((player, index) => {
                  const isRequired = index < 6;
                  const labelText =
                    index === 0 ? 'Captain' : `Player ${index + 1}`;

                  return (
                    <div key={index} className="roster-player">
                      <label htmlFor={`player-${index}`}>
                        {labelText}
                        {isRequired ? ' *' : ''}
                      </label>
                      <input
                        type="text"
                        id={`player-${index}`}
                        name={`player-${index}`}
                        value={player.name}
                        onChange={(e) => handleRosterChange(index, e)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {registrationType === 'free-agent' && (
            <div id="free-agent-fields" className="form-group">
              <label htmlFor="free-agent-name">Name *</label>
              <input type="text" id="free-agent-name" name="free_agent_name" />
              <span className="error-message">This field is required</span>

              <label htmlFor="free-agent-email">Email *</label>
              <input
                type="text"
                id="free-agent-email"
                name="free-agent-email"
              />
              <span className="error-message">This field is required</span>

              <label htmlFor="free-agent-city">Home City *</label>
              <input type="text" id="free-agent-city" name="free_agent_city" />
              <span className="error-message">This field is required</span>

              <label htmlFor="free-agent-experience">Experience *</label>
              <select
                id="free-agent-experience"
                name="free_agent_experience"
                required
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="">-- Select Experience Level --</option>
                <option value="novice">Novice(0-1 year)</option>
                <option value="intermediate">Intermediate(1-3 years)</option>
                <option value="expert">Advanced(3+ years)</option>
              </select>
              <span className="error-message">This field is required</span>
            </div>
          )}

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default EventRegistration;
