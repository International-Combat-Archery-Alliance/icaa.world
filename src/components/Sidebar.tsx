import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '@/components/Login';
import { useUserInfo } from '@/context/userInfoContext';

export default function Sidebar() {
  const { userInfo, isSuccess } = useUserInfo();

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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
          <li>
            <Link to="/our-communities" onClick={() => setSidebarOpen(false)}>
              The Alliance
            </Link>
          </li>
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
        </ul>
        <div className="mt-auto p-4">
          <Login />
        </div>
      </nav>
      <div className="content-overlay"></div>
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
