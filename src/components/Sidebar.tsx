import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Login from '@/components/Login';
import { useUserInfo } from '@/context/userInfoContext';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
  { to: '/player-profile', label: 'Player Profiles', adminOnly: true },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { userInfo, isSuccess } = useUserInfo();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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
            className={
              isActive(item.to)
                ? 'block px-6 py-4 text-lg font-bold text-white bg-[var(--primary)]/20 border-l-4 border-[var(--primary)] transition-colors hover:bg-[var(--primary)]/30'
                : 'block px-6 py-4 text-lg font-medium text-white border-l-4 border-transparent transition-colors hover:bg-[var(--sidebar-accent)]'
            }
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 overflow-auto py-4">
        <NavLinks onNavigate={onNavigate} />
      </nav>
      <div className="px-6 pt-4">
        <Login />
      </div>
    </div>
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
        <div className="flex h-full flex-col py-6">
          <div className="mb-6 px-6">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logos/ICAA Logo transparent.png"
                alt="ICAA Logo"
                className="h-36 w-auto"
              />
            </Link>
          </div>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Header Bar with Menu */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-[#0a1c4a] px-4 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 border-r-0 bg-[#0a1c4a] p-0 text-white"
          >
            <div className="flex h-full flex-col py-6">
              <SheetHeader className="mb-6 px-6">
                <SheetTitle asChild>
                  <Link to="/" onClick={closeSidebar}>
                    <img
                      src="/images/logos/ICAA Logo transparent.png"
                      alt="ICAA Logo"
                      className="h-20 w-auto"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <SidebarContent onNavigate={closeSidebar} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logos/ICAA Logo transparent.png"
            alt="ICAA"
            className="h-10 w-auto"
          />
        </Link>

        {/* Spacer to center the logo */}
        <div className="w-9" />
      </header>
    </>
  );
}
