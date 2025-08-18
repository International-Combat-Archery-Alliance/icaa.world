import React from 'react';
import ArcheryMap from '../components/ArcheryMap';

const OurCommunities = () => {
    return (
        <section id="our-communities" className="content-section communities-section">
            <h2 className="section-title">The Alliance</h2>
            <ArcheryMap />
            <div className="content-wrapper community-grid">

                <div id="agb-card" className="community-card">
                    <a href="https://www.archerygamesboston.com/" target="_blank" rel="noopener noreferrer">
                        <img src="images/logos/AG-Boston.avif" alt="Archery Games Boston Logo" className="community-logo" />
                        <h3>Archery Games Boston</h3>
                        <p>Chelsea, MA, United States</p>
                    </a>
                    <div className="community-links">
                        <a href="https://docs.google.com/spreadsheets/d/1EiXynEr0tKIWkiXhIuJtLPGbSmtx5TqccVkJHpQ1dzU/edit?usp=drivesdk" target="_blank" rel="noopener noreferrer">League Statistics</a>
                        <a href="https://sites.google.com/d/10DF8kWQJicNYqm3y11i7lp1hS5vylWi-/p/1V2AA4wpcmY2sx59hoC0B8dk48WU9OgzX/edit?pli=1" target="_blank" rel="noopener noreferrer">League Website</a>
                    </div>
                </div>

                <a id="ago-card" href="https://www.archerygames.ca/" className="community-card" target="_blank" rel="noopener noreferrer">
                    <img src="images/logos/AG-Ottawa.avif" alt="Archery Games Ottawa Logo" className="community-logo" />
                    <h3>Archery Games Ottawa</h3>
                    <p>Ottawa, ON, Canada</p>
                </a>

                <a id="agd-card" href="https://archerygamesdenver.com/" className="community-card" target="_blank" rel="noopener noreferrer">
                    <img src="images/logos/AG-Ottawa.avif" alt="Archery Games Denver Logo" className="community-logo" />
                    <h3>Archery Games Denver</h3>
                    <p>Arvada, CO, United States</p>
                </a>

                <a id="cda-card" href="https://combatdarchers.ca/en/combat-archery/" className="community-card" target="_blank" rel="noopener noreferrer">
                    <img src="images/logos/Combat d' Archers.png" alt="Combat d'Archers Logo" className="community-logo-alt" />
                    <h3>Combat d'Archers</h3>
                    <p>Montréal, QC, Canada</p>
                </a>

                <a id="cdas-card" href="https://combatdarcherssherbrooke.ca/en/booking-combat-archery/" className="community-card" target="_blank" rel="noopener noreferrer">
                    <img src="images/logos/Combat d' Archers.png" alt="Combat d'Archers Sherbrooke Logo" className="community-logo-alt" />
                    <h3>Combat d'Archers Sherbrooke</h3>
                    <p>Sherbrooke, QC, Canada</p>
                </a>

                <a id="aa-card" href="https://archersarena.com/" className="community-card" target="_blank" rel="noopener noreferrer">
                    <img src="images/logos/Archers Arena.PNG" alt="Archers Arena Logo" className="community-logo" />
                    <h3>Archers Arena</h3>
                    <p>Toronto, ON, Canada</p>
                </a>

            </div>
        </section>
    );
};

export default OurCommunities;
