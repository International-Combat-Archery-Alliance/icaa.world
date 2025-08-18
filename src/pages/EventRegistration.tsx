import { Link } from 'react-router-dom';

const EventRegistration = () => {
    return (
        <section id="event-registration" className="content-section event-registration-section">
            <Link to="/events" className="back-btn">← Back to Events</Link>
            <h2 className="section-title">Event Registration</h2>
            <div className="content-wrapper">
                <form id="event-registration-form" className="event-registration-form">
                    <label htmlFor="event-select">Event Name *</label>
                    <select id="event-select" name="event_name" required>
                        <option value="">-- Select an Event --</option>
                        <option value="catch-2025">C.A.T.C.H 2025</option>
                        <option value="boston-play-ins">Boston Play In Tournament</option>
                        <option value="boston-championship">Boston International Championship</option>
                        <option value="catch-2026">C.A.T.C.H. 2026</option>
                    </select>

                    <label htmlFor="registration-type">Registration Type *</label>
                    <select id="registration-type" name="registration_type" required>
                        <option value="">-- Select a Type --</option>
                        <option value="team">Team Registration</option>
                        <option value="free-agent">Free Agent</option>
                    </select>

                    <div id="team-fields" className="form-group">
                        <label htmlFor="team-name">Team Name *</label>
                        <input type="text" id="team-name" name="team_name" />
                        <span className="error-message">This field is required</span>

                        <label htmlFor="team-city">Home City *</label>
                        <input type="text" id="team-city" name="team_city" />
                        <span className="error-message">This field is required</span>

                        <label>Roster (8 Players) *</label>
                        <div className="roster-table" id="roster-fields">
                        </div>
                    </div>

                    <div id="free-agent-fields" className="form-group">
                        <label htmlFor="free-agent-name">Name *</label>
                        <input type="text" id="free-agent-name" name="free_agent_name" />
                        <span className="error-message">This field is required</span>

                        <label htmlFor="free-agent-city">Home City *</label>
                        <input type="text" id="free-agent-city" name="free_agent_city" />
                        <span className="error-message">This field is required</span>

                        <label htmlFor="free-agent-experience">Experience *</label>
                        <textarea id="free-agent-experience" name="free_agent_experience" rows={5}></textarea>
                        <span className="error-message">This field is required</span>
                    </div>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
        </section>
    );
};

export default EventRegistration;
