import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import AboutICAA from './pages/AboutICAA';
import AboutSport from './pages/AboutSport';
import OfficialRules from './pages/OfficialRules';
import OurCommunities from './pages/OurCommunities';
import Events from './pages/Events';
import EventRegistration from './pages/EventRegistration';
import NewsItem1 from './pages/news/NewsItem1';
import NewsItem2 from './pages/news/NewsItem2';
import NewsItem3 from './pages/news/NewsItem3';
import BostonPlayIns from './pages/events/BostonPlayIns';
import BostonChampionship from './pages/events/BostonChampionship';
import Catch2026 from './pages/events/Catch2026';
import Registration from './pages/Registration';
import RegistrationsTablePage from './pages/RegistrationsTablePage';
import Contact from './pages/Contact';
import AdminPage from './pages/Admin';
import { EventQueryClientProvider } from './context/eventQueryClientContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventRegistrationFreeAgent from './pages/EventRegistrationFreeAgent';
import EventRegistrationTeam from './pages/EventRegistrationTeam';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Login from './components/Login';
import { LoginQueryClientProvider } from './context/loginQueryClientContext';

const App = () => {
  const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <LoginQueryClientProvider>
        <EventQueryClientProvider>
          <GoogleOAuthProvider clientId="1008624351875-q36btbijttq83bogn9f8a4srgji0g3qg.apps.googleusercontent.com">
            <Router>
              <div className="app-container">
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
                      <Link
                        to="/about-icaa"
                        onClick={() => setSidebarOpen(false)}
                      >
                        About The ICAA
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about-sport"
                        onClick={() => setSidebarOpen(false)}
                      >
                        About The Sport
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/our-communities"
                        onClick={() => setSidebarOpen(false)}
                      >
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
                    <li>
                      <Link to="/admin" onClick={() => setSidebarOpen(false)}>
                        Admin
                      </Link>
                    </li>
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

                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-icaa" element={<AboutICAA />} />
                    <Route path="/about-sport" element={<AboutSport />} />
                    <Route path="/official-rules" element={<OfficialRules />} />
                    <Route
                      path="/our-communities"
                      element={<OurCommunities />}
                    />
                    <Route path="/events" element={<Events />} />
                    <Route
                      path="/events/:eventId/register-free-agent"
                      element={<EventRegistrationFreeAgent />}
                    />
                    <Route
                      path="/events/:eventId/register-team"
                      element={<EventRegistrationTeam />}
                    />
                    <Route
                      path="/event-registration"
                      element={<EventRegistration />}
                    />
                    <Route path="/news/icaa-partners" element={<NewsItem1 />} />
                    <Route path="/news/new-rules" element={<NewsItem2 />} />
                    <Route
                      path="/news/boston-championship-recap"
                      element={<NewsItem3 />}
                    />
                    <Route
                      path="/events/boston-play-ins"
                      element={<BostonPlayIns />}
                    />
                    <Route
                      path="/events/boston-championship"
                      element={<BostonChampionship />}
                    />
                    <Route path="/events/catch-2026" element={<Catch2026 />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route
                      path="/registrations-table"
                      element={<RegistrationsTablePage />}
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<AdminPage />} />
                  </Routes>
                </main>

                <footer>
                  <div className="social-links">
                    <a
                      href="https://www.youtube.com/@combatarcheryboston9136"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/images/logos/youtube.png"
                        alt="YouTube"
                        className="social-icon"
                      />
                    </a>
                    <a
                      href="https://x.com/yourhandle"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/images/logos/X.jfif"
                        alt="X (formerly Twitter)"
                        className="social-icon"
                      />
                    </a>
                    <a
                      href="https://www.instagram.com/yourprofile/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/images/logos/instagram.jfif"
                        alt="Instagram"
                        className="social-icon"
                      />
                    </a>
                  </div>
                  <p>
                    &copy; 2025 International Combat Archery Alliance, Inc. All
                    Rights Reserved.
                  </p>
                </footer>
              </div>
            </Router>
          </GoogleOAuthProvider>
        </EventQueryClientProvider>
      </LoginQueryClientProvider>
    </QueryClientProvider>
  );
};

export default App;
