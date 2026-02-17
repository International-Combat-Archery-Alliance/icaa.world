import { useLocation } from 'react-router-dom';

const routeToHeaderMap: Record<string, string> = {
  '/about-icaa': 'About The ICAA',
  '/about-sport': 'The Sport: Combat Archery',
  '/official-rules': 'Official Rules',
  '/our-communities': 'The Alliance',
  '/events': 'Events',
  '/news/icaa-launch': 'The Launch of the ICAA',
  '/news/rules': 'New Official Tournament Rules',
  '/contact': 'Contact Us',
  '/admin': 'Admin',
  '/player-profile': 'Player Profiles',
  '/mailing-list': 'Mailing List Sign Up',
};

function getHeaderTextForParameterizedRoute(pathname: string): string | null {
  // Handle event registration routes
  if (pathname.match(/^\/events\/[^\/]+\/register-free-agent$/)) {
    return 'Free Agent Registration';
  }

  if (pathname.match(/^\/events\/[^\/]+\/register-team$/)) {
    return 'Team Registration';
  }

  if (pathname.match(/^\/events\/[^\/]+\/payment$/)) {
    return 'Event Payment';
  }

  if (pathname.match(/^\/events\/[^\/]+\/success$/)) {
    return 'Thank you for signing up!';
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
    <header className="bg-[#0a1c4a] md:ml-64">
      <div className="py-4 px-4 md:px-8 flex items-center justify-center">
        <h1 className="text-center font-['Montserrat',sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#ff5722]">
          {headerText}
        </h1>
      </div>
    </header>
  );
}
