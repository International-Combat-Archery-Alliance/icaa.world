import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '@/components/Login';
import { useUserInfo } from '@/context/userInfoContext';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

export default function Sidebar() {
  const { userInfo, isSuccess } = useUserInfo();

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
            <Link to="/" onClick={() => setSidebarOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about-icaa" onClick={() => setSidebarOpen(false)}>
              About The ICAA
            </Link>
          </li>
          <li>
            <Link to="/about-sport" onClick={() => setSidebarOpen(false)}>
              About The Sport
            </Link>
          </li>
          {isSuccess && userInfo?.isAdmin ? (
            <li>
              <Link to="/our-communities" onClick={() => setSidebarOpen(false)}>
                The Alliance
              </Link>
            </li>
          ) : null}
          <li>
            <Link to="/events" onClick={() => setSidebarOpen(false)}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setSidebarOpen(false)}>
              Contact Us
            </Link>
          </li>
          {isSuccess && userInfo?.isAdmin ? (
            <li>
              <Link to="/admin" onClick={() => setSidebarOpen(false)}>
                Admin
              </Link>
            </li>
          ) : null}

          <li>
            <Link to="/player-profile" onClick={() => setSidebarOpen(false)}>
              Player Profile
            </Link>
          </li>
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
