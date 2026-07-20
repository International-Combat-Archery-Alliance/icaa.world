import { useState } from 'react';
import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import ArcheryMap, {
  communities,
  type Community,
} from '../components/ArcheryMap';
import { Card, CardContent } from '@/components/ui/card';

const OurCommunities = () => {
  useTitle('Our Communities - ICAA');
  const [hoveredCommunity, setHoveredCommunity] = useState<Community | null>(
    null,
  );

  const findCommunity = (name: string) =>
    communities.find((c) => c.name === name) || null;

  return (
    <section
      id="our-communities"
      className="content-section communities-section"
    >
      <div className="sticky top-14 md:top-0 z-10 bg-background pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
        <ArcheryMap
          hoveredCommunity={hoveredCommunity}
          setHoveredCommunity={setHoveredCommunity}
        />
      </div>
      <div className="content-wrapper community-grid">
        <div id="agb-card" className="community-card">
          <a
            href="https://www.archerygamesboston.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() =>
              setHoveredCommunity(findCommunity('Archery Games Boston'))
            }
            onMouseLeave={() => setHoveredCommunity(null)}
          >
            <img
              src="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archery Games Ottawa'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archery Games Denver'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity("Combat d'Archers"))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/0c1d759c-5037-42f1-8d6c-d363d0994595.png"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity("Combat d'Archers Sherbrooke"))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/0c1d759c-5037-42f1-8d6c-d363d0994595.png"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archers Arena'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/844ecea2-85de-4e17-82bf-b588dc23561a.PNG"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archery Games Omaha'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
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
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archery Arena'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/31f6aff8-548a-4596-bd3c-e24f53e7f1ca.webp"
            alt="Archery Arena Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archery Arena</h3>
          <p>Cincinnati, OH, United States</p>
        </a>

        <a
          id="ss-card"
          href="https://www.sherwoodshowdown.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Sherwood Showdown'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/1c1c3769-7a9e-463d-8e2b-1a816802254d.webp"
            alt="Sherwood Showdown Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Sherwood Showdown</h3>
          <p>Colorado Springs, CO, United States</p>
        </a>

        <a
          id="abf-card"
          href="https://www.archersbattlefield.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archers Battlefield'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/6ad51cdd-9da2-43fe-b9bd-3caec80a04c7.webp"
            alt="Archers Battlefield Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archers Battlefield</h3>
          <p>Pickering, ON, Canada</p>
        </a>

        <a
          id="abat-card"
          href="https://archery-battles.com/"
          className="community-card"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() =>
            setHoveredCommunity(findCommunity('Archery Battles'))
          }
          onMouseLeave={() => setHoveredCommunity(null)}
        >
          <img
            src="https://assets.icaa.world/cd522f2b-c7db-42d2-a3ec-8fba43be8e14.avif"
            alt="Archery Battles Logo"
            className="max-w-[100px] h-auto mb-4 inline-block"
          />
          <h3>Archery Battles</h3>
          <p>Austin, TX, United States</p>
        </a>
      </div>
      <div className="content-wrapper">
        <Card className="max-w-lg mx-auto">
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t see a location near you?{' '}
              <Link to="/contact" className="text-primary hover:underline">
                Contact us
              </Link>{' '}
              and we can work with you to get something set up near you!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OurCommunities;
