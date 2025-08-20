import React, { useState } from 'react';

const EventRegistrationForm = () => {
  const [eventSelect, setEventSelect] = useState('');
  const [registrationType, setRegistrationType] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamCity, setTeamCity] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>(Array(8).fill(''));
  const [freeAgentName, setFreeAgentName] = useState('');
  const [freeAgentCity, setFreeAgentCity] = useState('');
  const [freeAgentExperience, setFreeAgentExperience] = useState('');

  const handlePlayerNameChange = (index: number, value: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = value;
    setPlayerNames(newPlayerNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (eventSelect === '') {
      isValid = false;
      // Add error styling
    }

    if (registrationType === '') {
      isValid = false;
      // Add error styling
    }

    if (registrationType === 'team') {
      if (teamName.trim() === '') {
        isValid = false; /* error */
      }
      if (teamCity.trim() === '') {
        isValid = false; /* error */
      }
      for (let i = 0; i < 6; i++) {
        // Original script only validated first 6 players
        if (playerNames[i].trim() === '') {
          isValid = false; /* error */
        }
      }
    }

    if (registrationType === 'free-agent') {
      if (freeAgentName.trim() === '') {
        isValid = false; /* error */
      }
      if (freeAgentCity.trim() === '') {
        isValid = false; /* error */
      }
      if (freeAgentExperience.trim() === '') {
        isValid = false; /* error */
      }
    }

    if (!isValid) {
      alert('Please fill in all required fields.');
      return;
    }

    alert('Event registration submitted successfully!');
    // Further submission logic here
  };

  return (
    <form
      id="event-registration-form"
      className="event-registration-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="event-select">Event Name *</label>
      <select
        id="event-select"
        name="event_name"
        required
        value={eventSelect}
        onChange={(e) => setEventSelect(e.target.value)}
      >
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
          <input
            type="text"
            id="team-name"
            name="team_name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <span className="error-message">This field is required</span>

          <label htmlFor="team-city">Home City *</label>
          <input
            type="text"
            id="team-city"
            name="team_city"
            value={teamCity}
            onChange={(e) => setTeamCity(e.target.value)}
          />
          <span className="error-message">This field is required</span>

          <label>Roster (8 Players) *</label>
          <div className="roster-table" id="roster-fields">
            {playerNames.map((name, index) => (
              <div key={index} className="roster-player">
                <label htmlFor={`player-name-${index}`}>
                  Player {index + 1}
                </label>
                <input
                  type="text"
                  id={`player-name-${index}`}
                  name={`player_name_${index}`}
                  value={name}
                  onChange={(e) =>
                    handlePlayerNameChange(index, e.target.value)
                  }
                />
                <span className="error-message">This field is required</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {registrationType === 'free-agent' && (
        <div id="free-agent-fields" className="form-group">
          <label htmlFor="free-agent-name">Name *</label>
          <input
            type="text"
            id="free-agent-name"
            name="free_agent_name"
            value={freeAgentName}
            onChange={(e) => setFreeAgentName(e.target.value)}
          />
          <span className="error-message">This field is required</span>

          <label htmlFor="free-agent-city">Home City *</label>
          <input
            type="text"
            id="free-agent-city"
            name="free_agent_city"
            value={freeAgentCity}
            onChange={(e) => setFreeAgentCity(e.target.value)}
          />
          <span className="error-message">This field is required</span>

          <label htmlFor="free-agent-experience">Experience *</label>
          <textarea
            id="free-agent-experience"
            name="free_agent_experience"
            rows={5}
            value={freeAgentExperience}
            onChange={(e) => setFreeAgentExperience(e.target.value)}
          ></textarea>
          <span className="error-message">This field is required</span>
        </div>
      )}

      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
};

export default EventRegistrationForm;
