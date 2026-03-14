import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';

const NewsItem6 = () => {
  useTitle('ICAA Begins to welcome Volunteers! - ICAA News');

  return (
    <section id="news-item-6" className="content-section news-page">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 text-balance">
            The ICAA needs help! Come Join Us!
          </h1>
          <p className="text-sm text-muted-foreground">March 14, 2026</p>
        </header>

        <div className="flex flex-col gap-6 text-lg text-justify">
          <p>
            For those of you who are new here, the International Combat Archery
            Alliance (ICAA) was founded to give this sport the structure and
            global platform it deserves. Our mission is to bridge the gap
            between casual play and professional competition, creating a safe,
            standardized, and high-energy environment for players and clubs
            everywhere. We are focusing on building a global community that
            encompasses players and volunteers from all over the world. We want
            to see Combat Archery recognized as a world-class sport with a
            world-class community, and every step we take is focused on that
            goal.
          </p>
          <p>We have two big updates to share with you today:</p>
          <p>
            <b>1. We are officially opening volunteer roles.</b> We are at a
            point where we can finally bring on a team to help us grow. If you
            have skills in any of these areas and want to get involved, please
            feel free to reach out to me directly or contact us via{' '}
            <Link to="/contact" className="text-primary hover:underline">
              icaa.world/contact{' '}
            </Link>
            (my info can be found at the bottom of this article):
          </p>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              <b>Sponsorship & Partnerships:</b> Help us connect with brands to
              support our mission.
            </li>
            <li>
              <b>Community Outreach:</b> Work with clubs globally to ensure they
              have a great experience with the ICAA.
            </li>
            <li>
              <b>Media & Creative Production:</b> Help with filming, video
              editing, graphic design, and content writing.
            </li>
            <li>
              <b>Governance & Policy:</b> Help us draft the internal and
              external policies that keep the ICAA safe.
            </li>
            <li>
              <b>Referee Training:</b> Help build the program that trains and
              certifies our officials.
            </li>
            <li>
              <b>Non-Profit Legal Support:</b> Guide us through the legal side
              of staying compliant and protected.
            </li>
            <li>
              <b>Website Development:</b> Help us build and maintain a great
              digital home for the community.
            </li>
            <li>
              <b>Other:</b> If you have other skills or expertise and feel you
              can be an asset to our organization and community, please don't
              hesitate to still reach out. We can find the best way to utilize
              your skills!
            </li>
          </ul>
          <p>
            <b>2. A major milestone (and a big ask)</b>
          </p>
          <p>
            We have some huge news: we are currently working with a major
            television network to produce a live Combat Archery event later this
            year. We will be sending out more updates to the event as we learn
            them so stay tuned!
          </p>
          <p>
            To do this right, we are facing a substantial cost of production.
            While we are moving quickly to secure sponsorships, we want to
            ensure this event happens on our terms, truly represents the
            community and helps the sport grow. Any contribution, no matter the
            size, helps us get there.
          </p>
          <p>
            If you are in a position to help us reach this goal, you can donate
            here:{' '}
            <Link to="/donate" className="text-primary hover:underline">
              icaa.world/donate
            </Link>
            . Whether it is $10 or $10,000, every bit of support helps us cross
            the finish line. I cannot tell you how much we appreciate this
            community.
          </p>
          <p>
            As always, please feel free to email me, text me, message me,
            contact us via{' '}
            <Link to="/contact" className="text-primary hover:underline">
              icaa.world/contact
            </Link>
            , or any method to get a hold of us, if you have any questions,
            comments, suggestions or even just want to say hi. We cannot unify
            and build Combat Archery as a legitimate sport without the opinions
            of everyone. We have some very exciting things planned for the near
            and far future.
          </p>
          <p>
            Let's work together to turn this silly little game we all love into
            a recognized sport that everyone can love!
          </p>
          <p>
            Sincerely,
            <br />
            <ul>
              <li>Cameron Cardwell | President</li>
              <li>978-855-7338</li>
              <li>Cameron.Cardwell@icaa.world</li>
            </ul>
          </p>
        </div>
        <img
          src="https://assets.icaa.world/a7744c62-8529-4f16-9e11-96a6779f9152.webp"
          alt="Cameron Cardwell headshot"
          className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-lg object-cover my-8"
        />
      </div>
    </section>
  );
};

export default NewsItem6;
