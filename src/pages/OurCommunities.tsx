import { useTitle } from 'react-use';
import ArcheryMap from '../components/ArcheryMap';

const OurCommunities = () => {
  useTitle('Our Communities - ICAA');

  return (
    <section
      id="our-communities"
      className="content-section communities-section"
    >
      <ArcheryMap />
      <div className="content-wrapper community-grid">
        <div id="agb-card" className="community-card">
          <a
            href="https://www.archerygamesboston.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="images/logos/AG-Boston.avif"
              alt="Archery Games Boston Logo"
              className="max-w-[100px] h-auto mb-4 inline-block"
            />
            <h3>Archery Games Boston</h3>
            <p>Chelsea, MA, United States</p>
          </a>
          <div className="community-links">
            <a
              href="https://docs.google.com/spreadsheets/d/1EiXynEr0tKIWkiXhIuJtLPGbSmtx5TqccVkJHpQ1dzU/edit?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              League Statistics
            </a>
            <a
              href="https://sites.google.com/d/10DF8kWQJicNYqm3y11i7lp1hS5vylWi-/p/1V2AA4wpcmY2sx59hoC0B8dk48WU9OgzX/edit?pli=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              League Website
            </a>
          </div>
        </div>

        <a
          id="ago-card"
          href="https://www.archerygames.ca/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="images/logos/AG-Ottawa.avif"
            alt="Archery Games Ottawa Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archery Games Ottawa</h3>
          <p>Ottawa, ON, Canada</p>
        </a>

        <a
          id="agd-card"
          href="https://archerygamesdenver.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="images/logos/AG-Ottawa.avif"
            alt="Archery Games Denver Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archery Games Denver</h3>
          <p>Arvada, CO, United States</p>
        </a>

        <a
          id="cda-card"
          href="https://combatdarchers.ca/en/combat-archery/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="images/logos/Combat d' Archers.png"
            alt="Combat d'Archers Logo"
            className="max-w-[100px] h-auto mb-4 inline-block bg-[#0a1c4a]"
          />
          <h3>Combat d&apos;Archers</h3>
          <p>Montréal, QC, Canada</p>
        </a>

        <a
          id="cdas-card"
          href="https://combatdarcherssherbrooke.ca/en/booking-combat-archery/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="images/logos/Combat d' Archers.png"
            alt="Combat d'Archers Sherbrooke Logo"
            className="max-w-[100px] h-auto mb-4 inline-block bg-[#0a1c4a]"
          />
          <h3>Combat d&apos;Archers Sherbrooke</h3>
          <p>Sherbrooke, QC, Canada</p>
        </a>

        <a
          id="aa-card"
          href="https://archersarena.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="images/logos/Archers Arena.PNG"
            alt="Archers Arena Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archers Arena</h3>
          <p>Toronto, ON, Canada</p>
        </a>

        <a
          id="ago2-card"
          href="https://www.archerygamesomaha.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="images/logos/AG-Ottawa.avif"
            alt="Archery Games Omaha Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archery Games Omaha</h3>
          <p>Omaha, NE, United States</p>
        </a>

        <a
          id="aac-card"
          href="https://www.archery-arena.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>Archery Arena</h3>
          <p>Cincinnati, OH, United States</p>
        </a>

        <a
          id="ss-card"
          href="https://www.sherwoodshowdown.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>Sherwood Showdown</h3>
          <p>Colorado Springs, CO, United States</p>
        </a>

        <a
          id="abf-card"
          href="https://www.archersbattlefield.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>Archers Battlefield</h3>
          <p>Pickering, ON, Canada</p>
        </a>

        <a
          id="abat-card"
          href="https://archery-battles.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>Archery Battles</h3>
          <p>Austin, TX, United States</p>
        </a>
      </div>
    </section>
  );
};

export default OurCommunities;
