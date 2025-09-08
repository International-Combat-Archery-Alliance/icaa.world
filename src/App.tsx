import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import AboutICAA from './pages/AboutICAA';
import AboutSport from './pages/AboutSport';
import OfficialRules from './pages/OfficialRules';
import Events from './pages/Events';
import NewsItem1 from './pages/news/NewsItem1';
import NewsItem2 from './pages/news/NewsItem2';
import NewsItem3 from './pages/news/NewsItem3';
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
import { LoginQueryClientProvider } from './context/loginQueryClientContext';
import AdminOnlyRoute from './components/auth/AdminOnlyRoute';
import Sidebar from './components/Sidebar';
import { UserInfoContextProvider } from './context/userInfoContext';
import OurCommunities from './pages/OurCommunities';
import EventDetailsPage from './components/EventPageTemplate';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LoginQueryClientProvider>
        <EventQueryClientProvider>
          <GoogleOAuthProvider clientId="1008624351875-q36btbijttq83bogn9f8a4srgji0g3qg.apps.googleusercontent.com">
            <UserInfoContextProvider>
              <Router>
                <div className="app-container">
                  <Sidebar />

                  <Header />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about-icaa" element={<AboutICAA />} />
                      <Route path="/about-sport" element={<AboutSport />} />
                      <Route
                        path="/official-rules"
                        element={<OfficialRules />}
                      />
                      <Route
                        path="/our-communities"
                        element={
                          <AdminOnlyRoute>
                            <OurCommunities />
                          </AdminOnlyRoute>
                        }
                      />
                      <Route path="/events" element={<Events />} />
                      <Route
                        path="/events/:eventId/event-details"
                        element={<EventDetailsPage />}
                      />
                      <Route
                        path="/events/:eventId/register-free-agent"
                        element={<EventRegistrationFreeAgent />}
                      />
                      <Route
                        path="/events/:eventId/register-team"
                        element={<EventRegistrationTeam />}
                      />
                      <Route path="/registration" element={<Registration />} />
                      <Route
                        path="/registrations-table"
                        element={<RegistrationsTablePage />}
                      />
                      <Route path="/contact" element={<Contact />} />
                      <Route
                        path="/admin"
                        element={
                          <AdminOnlyRoute>
                            <AdminPage />
                          </AdminOnlyRoute>
                        }
                      />
                      <Route path="/news/icaa-launch" element={<NewsItem1 />} />
                      <Route path="/news/rules" element={<NewsItem2 />} />
                      <Route path="/news/play-ins-results" element={<NewsItem3 />} />
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
                      {/*
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
                      */}
                    </div>
                    <p>
                      &copy; 2025 International Combat Archery Alliance, Inc.
                      All Rights Reserved.
                    </p>
                  </footer>
                </div>
              </Router>
            </UserInfoContextProvider>
          </GoogleOAuthProvider>
        </EventQueryClientProvider>
      </LoginQueryClientProvider>
    </QueryClientProvider>
  );
};

export default App;
