import { Link } from 'react-router-dom';

const AboutSport = () => {
    return (
        <section id="about-sport" className="content-section">
            <h2 className="section-title">The Sport: Combat Archery</h2>
            <div className="content-wrapper">
                <p>Combat Archery is a high-energy, team-based sport that merges the fast-paced, elimination-style action of dodgeball with the precision and skill of archery. Using safe, foam-tipped arrows, players work to eliminate opponents while also having the opportunity to catch an arrow to revive a fallen teammate. While the sport is safe and accessible for all skill levels, it demands a high degree of strategy and teamplay to succeed, boasting a competitive ceiling that requires technical proficiency in shooting under pressure, quick strategic thinking, and the athleticism to catch an arrow mid-flight.
                    
                </p>
                <img src="images/Rotating Archery Photos/2.jpg" alt="Combat Archery in action" className="sport-photo" />
                <div className="official-rules-link">
                    <Link to="/official-rules" className="rules-btn">Official Rules</Link>
                </div>
            </div>
        </section>
    );
};

export default AboutSport;
