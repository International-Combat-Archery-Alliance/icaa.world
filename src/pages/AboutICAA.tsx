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
            Our vision is to be the central, trusted hub for competitive Combat
            Archery. Coordinating and running local, regional, and international
            events. Having one unified voice for the competitive world of Combat
            Archery.
          </p>
        </div>
        <div className="flex flex-wrap justify-center">
          <BoardMember
            name="Cameron Cardwell"
            title="President/Chair"
            email="cameron.cardwell@icaa.world"
            headshot="https://assets.icaa.world/a7744c62-8529-4f16-9e11-96a6779f9152.webp"
            actionshot="https://assets.icaa.world/349f2f02-23cb-44b4-a27e-e65e101b7e86.webp"
          />
          <BoardMember
            name="Andrew Mellen"
            title="Clerk"
            email="andrew.mellen@icaa.world"
            headshot="https://assets.icaa.world/79e5e03f-fb9f-47a7-a253-841073332dc1.webp"
            actionshot="https://assets.icaa.world/a8f9754e-546e-439a-90ec-d9d423cf5046.webp"
          />
          <BoardMember
            name="Kyle Best"
            title="Treasurer"
            email="kyle.best@icaa.world"
            headshot="https://assets.icaa.world/2ad11ea2-674b-49a9-a38e-c78566fdd88c.webp"
            actionshot="https://assets.icaa.world/5bd32348-7f85-4e30-9a53-7b7232c8172d.webp"
          />
          <BoardMember
            name="Timothy Ahong"
            title="Director"
            email="timothy.ahong@icaa.world"
            headshot="https://assets.icaa.world/feb7506d-331a-401a-a37d-a51d02934a33.webp"
            actionshot="https://assets.icaa.world/dd7d12b1-5735-4014-8ea9-e0207ba41036.webp"
          />
          <BoardMember
            name="Yousef Hariri"
            title="Director"
            email="yousef.hariri@icaa.world"
            headshot="https://assets.icaa.world/7e5d1bcc-298a-49bc-8743-135ed0dbb44e.webp"
            actionshot="https://assets.icaa.world/3194fcad-ff13-44ad-b510-2e62aa1f867f.webp"
          />
        </div>
      </div>
    </section>
  );
};

export default Leadership;
