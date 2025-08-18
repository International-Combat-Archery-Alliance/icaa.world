import { Link } from 'react-router-dom';

const AboutSport = () => {
    return (
        <section id="about-sport" className="content-section">
            <h2 className="section-title">The Sport: Combat Archery</h2>
            <div className="content-wrapper">
                <p>Combat Archery is an intense, team-based sport that blends the fast-paced, elimination-style action of dodgeball with the timeless skill of archery. Wielding safe, foam-tipped arrows, players must rely on communication, movement, and sharp team strategy to eliminate their opponents. It's a thrilling game where coordinated teamplay and precision are the keys to victory.</p>
                <img src="images/Rotating Archery Photos/2.jpg" alt="Combat Archery in action" className="sport-photo" />
                <div className="official-rules-link">
                    <Link to="/official-rules" className="rules-btn">Official Rules</Link>
                </div>
            </div>
        </section>
    );
};

export default AboutSport;
