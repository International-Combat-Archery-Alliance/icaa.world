import React, { useState, useEffect } from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import AboutICAA from './pages/AboutICAA';
import AboutSport from './pages/AboutSport';
import OfficialRules from './pages/OfficialRules';
import OurCommunities from './pages/OurCommunities';
import Events from './pages/Events';
import EventRegistration from './pages/EventRegistration';
import NewsItem1 from './pages/NewsItem1';
import NewsItem2 from './pages/NewsItem2';
import NewsItem3 from './pages/NewsItem3';
import Catch2025 from './pages/Catch2025';
import BostonPlayIns from './pages/BostonPlayIns';
import BostonChampionship from './pages/BostonChampionship';
import Catch2026 from './pages/Catch2026';
import Registration from './pages/Registration';
import RegistrationsTablePage from './pages/RegistrationsTablePage';
import Leadership from './pages/Leadership';
import Contact from './pages/Contact';

const App = () => {
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
        <Router>
            <div className="app-container">
                <nav id="sidebar" className="sidebar">
                    <ul className="sidebar-nav">
                        <div className="logo-container">
                            <img src="images/logos/ICAA Logo transparent.png" alt="ICAA Logo" className="logo" />
                        </div>
                        <li><Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link></li>
                        <li><Link to="/about-icaa" onClick={() => setSidebarOpen(false)}>About the ICAA</Link></li>
                        <li><Link to="/about-sport" onClick={() => setSidebarOpen(false)}>About the Sport</Link></li>
                        <li><Link to="/our-communities" onClick={() => setSidebarOpen(false)}>The Alliance</Link></li>
                        <li><Link to="/events" onClick={() => setSidebarOpen(false)}>Events</Link></li>
                        <li><Link to="/leadership" onClick={() => setSidebarOpen(false)}>Our Leadership</Link></li>
                        <li><Link to="/contact" onClick={() => setSidebarOpen(false)}>Contact Us</Link></li>
                    </ul>
                </nav>
                <div className="content-overlay"></div>
                <button className="menu-toggle" id="menu-toggle-btn" onClick={toggleSidebar}>☰</button>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about-icaa" element={<AboutICAA />} />
                        <Route path="/about-sport" element={<AboutSport />} />
                        <Route path="/official-rules" element={<OfficialRules />} />
                        <Route path="/our-communities" element={<OurCommunities />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/event-registration" element={<EventRegistration />} />
                        <Route path="/news/icaa-partners" element={<NewsItem1 />} />
                        <Route path="/news/new-rules" element={<NewsItem2 />} />
                        <Route path="/news/boston-championship-recap" element={<NewsItem3 />} />
                        <Route path="/events/catch-2025" element={<Catch2025 />} />
                        <Route path="/events/boston-play-ins" element={<BostonPlayIns />} />
                        <Route path="/events/boston-championship" element={<BostonChampionship />} />
                        <Route path="/events/catch-2026" element={<Catch2026 />} />
                        <Route path="/registration" element={<Registration />} />
                        <Route path="/registrations-table" element={<RegistrationsTablePage />} />
                        <Route path="/leadership" element={<Leadership />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>

                <footer>
                    <div className="social-links">
                        <a href="https://www.youtube.com/@combatarcheryboston9136" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/youtube.png" alt="YouTube" className="social-icon" />
                        </a>
                        <a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/X.jfif" alt="X (formerly Twitter)" className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/yourprofile/" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/instagram.jfif" alt="Instagram" className="social-icon" />
                        </a>
                    </div>
                    <p>&copy; 2025 International Combat Archery Alliance, Inc. All Rights Reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;