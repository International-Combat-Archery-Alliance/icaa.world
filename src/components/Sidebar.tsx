import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Login from '@/components/Login';
import { useUserInfo } from '@/context/userInfoContext';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Button } from '@/components/ui/button';

interface NavItem {
  to: string;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about-icaa', label: 'About The ICAA' },
  { to: '/about-sport', label: 'About The Sport' },
  { to: '/our-communities', label: 'The Alliance', adminOnly: true },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/admin', label: 'Admin', adminOnly: true },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { userInfo, isSuccess } = useUserInfo();

  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || (isSuccess && userInfo?.isAdmin),
  );

  return (
    <ul className="space-y-1">
      {visibleNavItems.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            onClick={onNavigate}
            className="block rounded-md px-4 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 hover:translate-x-1"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  useSwipeGesture({
    onSwipeRight: openSidebar,
    onSwipeLeft: isOpen ? closeSidebar : undefined,
    minSwipeDistance: 100,
    maxStartDistance: 50,
  });

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-[#0a1c4a] md:flex">
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 border-b border-white/10 pb-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logos/ICAA Logo transparent.png"
                alt="ICAA Logo"
                className="h-20 w-auto"
              />
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <NavLinks />
          </nav>
          <div className="border-t border-white/10 pt-4">
            <Login />
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={openSidebar}
        className="fixed left-4 top-4 z-50 h-10 w-10 border-2 border-white bg-[#0a1c4a] text-white hover:bg-[#0a1c4a]/90 hover:text-white md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeSidebar}
          />
          <div className="fixed left-0 top-0 z-50 h-screen w-72 bg-[#0a1c4a] p-6 md:hidden">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <Link to="/" onClick={closeSidebar}>
                  <img
                    src="/images/logos/ICAA Logo transparent.png"
                    alt="ICAA Logo"
                    className="h-16 w-auto"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeSidebar}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              <nav className="flex-1 overflow-auto py-4">
                <NavLinks onNavigate={closeSidebar} />
              </nav>
              <div className="border-t border-white/10 pt-4">
                <Login />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
