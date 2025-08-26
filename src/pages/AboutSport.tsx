import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Positions from '@/components/PositionsActions';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function AboutSport() {
  return (
    <section id="about-sport" className="content-section">
      <h2 className="section-title">The Sport: Combat Archery</h2>
      <Accordion
        type="multiple"
        className="w-full max-w-screen-lg mx-auto p-15"
        defaultValue={['summary']}
      >
        <AccordionItem value="summary">
          <AccordionTrigger className="text-primary text-3xl font-bold">
            {' '}
            What Is Combat Archery?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-justify text-lg">
            <p>
              Combat Archery is a high-energy, team-based sport that merges the
              fast-paced, elimination-style action of dodgeball with the
              precision and skill of archery. Using safe, foam-tipped arrows,
              players work to eliminate opponents while also having the
              opportunity to catch an arrow to revive a fallen teammate. While
              the sport is safe and accessible for all skill levels, it demands
              a high degree of strategy and teamplay to succeed, boasting a
              competitive ceiling that requires technical proficiency in
              shooting under pressure, quick strategic thinking, and the
              athleticism to catch an arrow mid-flight.
            </p>
            <iframe
              className="w-auto aspect-video my-4 self-center"
              src="https://www.youtube.com/embed/f-7pI_mnzVM"
              title="What is Combat Archery?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="rules">
          <AccordionTrigger className="text-primary text-3xl font-bold">
            {' '}
            The Basic Rules
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-justify text-lg">
            <li>There are 6 players per team on the field</li>
            <li>If you get hit with an arrow you are eliminated</li>
            <li>
              You revive a teammate by:
              <li className="ml-8">Catching an arrow</li>
              <li className="ml-8">Knocking out a Revive Target</li>
              <li className="ml-8">Hitting the Jailbreak Gong</li>
            </li>
            <li>
              Teams earn score for either fully eliminating a team or by having
              more players alive at the end of the round timer{' '}
            </li>

            <Button className="self-center text-xl" asChild>
              <Link to="/official-rules">Full Official Rules</Link>
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="positions">
          <AccordionTrigger className="text-primary text-3xl font-bold">
            {' '}
            The Positions
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="text-lg">
              <p>
                The positions below describe the general 4 playstyles that can
                make up the composition of a team:
              </p>
              <li>
                A more aggresive team may consist of 4 Forwards and 1 Rear Guard
                and 1 Centerback
              </li>
              <li>
                While a more passive, catching style team could consist of 2
                Rear Guards, 3 Centerbacks and a Flex
              </li>
            </p>
            <p className="text-lg">
              There are *endless* possibilites for team compositions. Try out
              different styles to find what fits you the best!
            </p>
            <Positions
              position="Forward"
              description="The Forward is the player who makes the space using their position and aggression. They are the the main aggressors, 
                        or sometimes the best bait..."
              icon="Forward"
              actionshot="Forward"
            />
            <Positions
              position="Rear Guard"
              description="The Rear Guard are the sharpshooters of the team. They typically play a bit safer in their position, but can be just as much, or more, of
                        an offensive weapon than the Forwards"
              icon="Rear Guard"
              actionshot="Rear Guard"
            />
            <Positions
              position="Centerback"
              description="The Centerback is the backbone of a team. They are responsible for making sure their team survives. Hanging back and making
                        catches, knocking out the Revive Targets, or even providing covering fire for their Forwards. Often times the Centerback is the Field General of the team,
                        being able to command the team from an advantageous point of view"
              icon="Centerback"
              actionshot="Centerback"
            />
            <Positions
              position="Flex"
              description="The Flex can do it all. They can interchange between providing pressure on the front lines, to picking off their opponents from
                        the saftey of cover, or to be the one to revive their entire team. Just remember the saying 'jack of all trades...master of none' "
              icon="Flex"
              actionshot="Flex"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

export default AboutSport;
