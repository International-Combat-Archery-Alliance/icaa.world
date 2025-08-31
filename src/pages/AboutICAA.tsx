import { useTitle } from 'react-use';
import BoardMember from '../components/BoardMember';

const Leadership = () => {
  useTitle('About ICAA - International Combat Archery Alliance');

  return (
    <section id="leadership-section" className="content-section">
      <div className="content-wrapper">
        <div className="leadership-intro">
          <p>
            We are a group of passionate individuals who share both a love for
            the sport of Combat Archery as well as a true and firm belief that
            the sport we love can develop and grow into a worldwide presence
          </p>
        </div>
        <div className="mission-vision">
          <h3>Our Mission</h3>
          <p>
            Our mission of the ICAA is to foster the growth of Combat Archery as
            a growing sport through the development of athletes, community
            events, tournaments, competitive leagues, and more.
          </p>
          <h3>Our Vision</h3>
          <p>
            {' '}
            Our vision is to be the central, trusted hub for competetive Combat
            Archery. Coordinating and running local, regional, and international
            events. Having one unified voice for the competetive world of Combat
            Archery.
          </p>
        </div>
        <div className="flex flex-wrap justify-center">
          <BoardMember
            name="Cameron Cardwell"
            title="President/Chair"
            email="cameron.cardwell@icaa.world"
            headshot="images/headshots/Cameron.jpg"
            actionshot="images/action shots/Cameron.jpg"
          />
          <BoardMember
            name="Andrew Mellen"
            title="Clerk"
            email="andrew.mellen@icaa.world"
            headshot="images/headshots/Andrew.jpeg"
            actionshot="images/action shots/Andrew.jpg"
          />
          <BoardMember
            name="Kyle Best"
            title="Treasurer"
            email="kyle.best@icaa.world"
            headshot="images/headshots/Kyle.jpg"
            actionshot="images/action shots/Kyle.jpg"
          />
          <BoardMember
            name="Timothy Ahong"
            title="Director"
            email="timothy.ahong@icaa.world"
            headshot="images/headshots/Tim.png"
            actionshot="images/action shots/Tim_2.jpg"
          />
          <BoardMember
            name="Yousef Hariri"
            title="Director"
            email="yousef.hariri@icaa.world"
            headshot="images/headshots/Yousef.jpg"
            actionshot="images/action shots/Yousef.jpg"
          />
        </div>
      </div>
    </section>
  );
};

export default Leadership;
