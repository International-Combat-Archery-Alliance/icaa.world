import { useEffect, useState } from 'react';
import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import ArcheryMap, { type Community } from '../components/ArcheryMap';
import { CommunityCard } from '@/components/CommunityCard';
import { Card, CardContent } from '@/components/ui/card';

const OurCommunities = () => {
  useTitle('Our Communities - ICAA');
  const [hoveredCommunity, setHoveredCommunity] = useState<Community | null>(
    null,
  );
  const [panTarget, setPanTarget] = useState<Community | null>(null);

  useEffect(() => {
    if (!hoveredCommunity) return;
    document
      .querySelector(`[data-community="${hoveredCommunity.name}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [hoveredCommunity]);

  const handleCardHover = (community: Community | null) => {
    setHoveredCommunity(community);
    setPanTarget(community);
  };

  return (
    <section id="our-communities" className="content-section bg-white">
      <div className="sticky top-14 md:top-0 z-10 bg-background pb-4 -mx-4 px-4 md:-mx-6 md:px-6">
        <ArcheryMap
          hoveredCommunity={hoveredCommunity}
          setHoveredCommunity={setHoveredCommunity}
          panTarget={panTarget}
        />
      </div>
      <div className="content-wrapper grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-8!">
        <CommunityCard
          id="agb-card"
          name="Archery Games Boston"
          isActive={hoveredCommunity?.name === 'Archery Games Boston'}
          logoUrl="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
          logoAlt="Archery Games Boston Logo"
          city="Chelsea, MA, United States"
          links={[
            {
              label: 'League Statistics',
              href: 'https://docs.google.com/spreadsheets/d/1EiXynEr0tKIWkiXhIuJtLPGbSmtx5TqccVkJHpQ1dzU/edit?usp=drivesdk',
            },
            {
              label: 'League Website',
              href: 'https://sites.google.com/d/10DF8kWQJicNYqm3y11i7lp1hS5vylWi-/p/1V2AA4wpcmY2sx59hoC0B8dk48WU9OgzX/edit?pli=1',
            },
          ]}
          onHover={handleCardHover}
        />
        <CommunityCard
          id="ago-card"
          name="Archery Games Ottawa"
          isActive={hoveredCommunity?.name === 'Archery Games Ottawa'}
          logoUrl="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
          logoAlt="Archery Games Ottawa Logo"
          city="Ottawa, ON, Canada"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="agd-card"
          name="Archery Games Denver"
          isActive={hoveredCommunity?.name === 'Archery Games Denver'}
          logoUrl="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
          logoAlt="Archery Games Denver Logo"
          city="Arvada, CO, United States"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="cda-card"
          name="Combat d'Archers"
          isActive={hoveredCommunity?.name === "Combat d'Archers"}
          logoUrl="https://assets.icaa.world/0c1d759c-5037-42f1-8d6c-d363d0994595.png"
          logoAlt="Combat d'Archers Logo"
          logoClassName="bg-[#0a1c4a]"
          city="Montréal, QC, Canada"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="cdas-card"
          name="Combat d'Archers Sherbrooke"
          isActive={hoveredCommunity?.name === "Combat d'Archers Sherbrooke"}
          logoUrl="https://assets.icaa.world/0c1d759c-5037-42f1-8d6c-d363d0994595.png"
          logoAlt="Combat d'Archers Sherbrooke Logo"
          logoClassName="bg-[#0a1c4a]"
          city="Sherbrooke, QC, Canada"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="aa-card"
          name="Archers Arena"
          isActive={hoveredCommunity?.name === 'Archers Arena'}
          logoUrl="https://assets.icaa.world/844ecea2-85de-4e17-82bf-b588dc23561a.PNG"
          logoAlt="Archers Arena Logo"
          city="Toronto, ON, Canada"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="ago2-card"
          name="Archery Games Omaha"
          isActive={hoveredCommunity?.name === 'Archery Games Omaha'}
          logoUrl="https://assets.icaa.world/6de623c6-71ce-4ad0-973e-1450a5b66d76.png"
          logoAlt="Archery Games Omaha Logo"
          city="Omaha, NE, United States"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="aac-card"
          name="Archery Arena"
          isActive={hoveredCommunity?.name === 'Archery Arena'}
          logoUrl="https://assets.icaa.world/31f6aff8-548a-4596-bd3c-e24f53e7f1ca.webp"
          logoAlt="Archery Arena Logo"
          city="Cincinnati, OH, United States"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="ss-card"
          name="Sherwood Showdown"
          isActive={hoveredCommunity?.name === 'Sherwood Showdown'}
          logoUrl="https://assets.icaa.world/1c1c3769-7a9e-463d-8e2b-1a816802254d.webp"
          logoAlt="Sherwood Showdown Logo"
          city="Colorado Springs, CO, United States"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="abf-card"
          name="Archers Battlefield"
          isActive={hoveredCommunity?.name === 'Archers Battlefield'}
          logoUrl="https://assets.icaa.world/6ad51cdd-9da2-43fe-b9bd-3caec80a04c7.webp"
          logoAlt="Archers Battlefield Logo"
          city="Pickering, ON, Canada"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="abat-card"
          name="Archery Battles"
          isActive={hoveredCommunity?.name === 'Archery Battles'}
          logoUrl="https://assets.icaa.world/cd522f2b-c7db-42d2-a3ec-8fba43be8e14.avif"
          logoAlt="Archery Battles Logo"
          city="Austin, TX, United States"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="batl-card"
          name="Barrie Archery Tag"
          isActive={hoveredCommunity?.name === 'Barrie Archery Tag'}
          logoUrl="https://assets.icaa.world/d59966c8-2302-4eae-ab66-08b08f8d69eb.webp"
          logoAlt="Barrie Archery Tag Logo"
          city="Barrie, ON, Canada"
          onHover={handleCardHover}
        />
        <CommunityCard
          id="tat-card"
          name="The Archertype"
          isActive={hoveredCommunity?.name === 'The Archertype'}
          logoUrl="https://assets.icaa.world/50b0adb3-663b-4ad7-afdf-52bd5fcdcf08.webp"
          logoAlt="The Archertype Logo"
          logoClassName="bg-black"
          city="Manchester, UK"
          onHover={handleCardHover}
        />
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
