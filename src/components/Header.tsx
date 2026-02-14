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
    <header className="bg-[#0a1c4a]">
      <div className="py-4 px-4 md:px-8 flex items-center justify-center">
        {/* Spacer for mobile to balance the hamburger button area */}
        <div className="w-10 md:hidden" />

        <h1 className="flex-1 text-center font-['Montserrat',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#ff5722]">
          {headerText}
        </h1>

        {/* Spacer to match left side */}
        <div className="w-10 md:hidden" />
      </div>
    </header>
  );
}
