import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from '@/components/Login';
import { useUserInfo } from '@/context/userInfoContext';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

export default function Sidebar() {
  const { userInfo, isSuccess } = useUserInfo();
  const location = useLocation();

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Add swipe gesture support
  useSwipeGesture({
    onSwipeRight: openSidebar,
    onSwipeLeft: isSidebarOpen ? closeSidebar : undefined,
    minSwipeDistance: 100,
    maxStartDistance: 50,
  });

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [isSidebarOpen]);

  return (
    <>
      <nav id="sidebar" className="sidebar flex flex-col">
        <ul className="sidebar-nav">
          <div className="logo-container">
            <img
              src="/images/logos/ICAA Logo transparent.png"
              alt="ICAA Logo"
              className="logo"
            />
          </div>
          <li>
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={
                isActive('/')
                  ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                  : 'border-l-4 border-transparent'
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about-icaa"
              onClick={() => setSidebarOpen(false)}
              className={
                isActive('/about-icaa')
                  ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                  : 'border-l-4 border-transparent'
              }
            >
              About The ICAA
            </Link>
          </li>
          <li>
            <Link
              to="/about-sport"
              onClick={() => setSidebarOpen(false)}
              className={
                isActive('/about-sport')
                  ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                  : 'border-l-4 border-transparent'
              }
            >
              About The Sport
            </Link>
          </li>
          {isSuccess && userInfo?.isAdmin ? (
            <li>
              <Link
                to="/our-communities"
                onClick={() => setSidebarOpen(false)}
                className={
                  isActive('/our-communities')
                    ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                    : 'border-l-4 border-transparent'
                }
              >
                The Alliance
              </Link>
            </li>
          ) : null}
          <li>
            <Link
              to="/events"
              onClick={() => setSidebarOpen(false)}
              className={
                isActive('/events')
                  ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                  : 'border-l-4 border-transparent'
              }
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => setSidebarOpen(false)}
              className={
                isActive('/contact')
                  ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                  : 'border-l-4 border-transparent'
              }
            >
              Contact Us
            </Link>
          </li>
          {isSuccess && userInfo?.isAdmin ? (
            <li>
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={
                  isActive('/admin')
                    ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                    : 'border-l-4 border-transparent'
                }
              >
                Admin
              </Link>
            </li>
          ) : null}
          {isSuccess && userInfo?.isAdmin ? (
          <li>
            <Link
              to="/player-profile"
              onClick={() => setSidebarOpen(false)}
              className={
                isActive('/player-profile')
                  ? 'font-bold text-primary bg-primary/10 border-l-4 border-primary'
                  : 'border-l-4 border-transparent'
              }
            >
              Player Profile
            </Link>
          </li>
          ) : null}
        </ul>
        <div className="mt-auto p-4">
          <Login />
        </div>
      </nav>

      {/* Add click handler to overlay to close sidebar */}
      <div className="content-overlay" onClick={closeSidebar}></div>
      <button
        className="menu-toggle"
        id="menu-toggle-btn"
        onClick={toggleSidebar}
      >
        ☰
      </button>
    </>
  );
}
