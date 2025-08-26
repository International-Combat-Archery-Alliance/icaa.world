import { GoogleLogin } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';

const routeToHeaderMap: Record<string, string> = {
  '/about-icaa': 'About The ICAA',
  '/about-sport': 'The Sport: Combat Archery',
  '/official-rules': 'Official Rules',
  '/our-communities': 'The Alliance',
  '/events': 'Events',
  '/event-registration': 'Event Registration',
  '/events/boston-play-ins': 'Boston Play Ins Tournament',
  '/events/boston-championship': 'Boston International Championship',
  '/events/catch-2026': 'C.A.T.C.H. 2026',
  '/news/icaa-partners': 'ICAA Partners with Top Combat Archery Gear Company',
  '/news/new-rules': 'New Official Rules for 2026 Season',
  '/news/boston-championship-recap':
    'Boston International Championship: Recap and Results',
  '/registration': 'Registration',
  '/registrations-table': 'Registrations',
  '/contact': 'Contact Us',
};

function getHeaderTextForParameterizedRoute(pathname: string): string | null {
  // Handle event registration routes
  if (pathname.match(/^\/events\/[^\/]+\/register-free-agent$/)) {
    return 'Free Agent Registration';
  }

  if (pathname.match(/^\/events\/[^\/]+\/register-team$/)) {
    return 'Team Registration';
  }

  return null;
}

export default function Header() {
  const location = useLocation();

  // Don't render header for home page - it has its own hero section
  if (location.pathname === '/') {
    return null;
  }

  const headerText =
    routeToHeaderMap[location.pathname] ||
    getHeaderTextForParameterizedRoute(location.pathname);

  if (!headerText) {
    return null;
  }

  return (
    <header>
      {/* ml is for the sidebar, can be removed if the sidebar is refactored */}
      <div className="md:ml-[250px] py-4 px-2 flex justify-between items-center bg-[#0a1c4a]">
        <div></div>
        <h2 className="font-['Montserrat', sans-serif] text-6xl text-center text-(--electric-orange)">
          {headerText}
        </h2>
        <GoogleLogin
          type="icon"
          shape="circle"
          onSuccess={(credentialResponse) => console.log(credentialResponse)}
        />
      </div>
    </header>
  );
}
