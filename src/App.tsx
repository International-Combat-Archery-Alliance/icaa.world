import React, { useState, useEffect } from 'react';
import './style.css';

import RegistrationForm from './components/RegistrationForm';
import RegistrationsTable from './components/RegistrationsTable';
import BoardMember from './components/BoardMember';
import ContactForm from './components/ContactForm';
import ArcheryMap from './components/ArcheryMap';

const App = () => {
    const [activeSection, setActiveSection] = useState('hero-section');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            if (section.id === activeSection) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }, [activeSection]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    }, [isSidebarOpen]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const totalImages = 65;
    const images = [];
    for (let i = 1; i <= totalImages; i++) {
        images.push(`images/Rotating Archery Photos/${i}.jpg`);
    }

    const changeImage = () => {
        const newIndex = Math.floor(Math.random() * images.length);
        setCurrentImageIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            changeImage();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <nav id="sidebar" className="sidebar">
                <ul className="sidebar-nav">
                    <div className="logo-container">
                        <img src="images/logos/ICAA Logo transparent.png" alt="ICAA Logo" className="logo" />
                    </div>
                    <li><a href="#" onClick={() => {setActiveSection('hero-section'); setSidebarOpen(false);}}>Home</a></li>
                    <li><a href="#" onClick={() => {setActiveSection('about-icaa'); setSidebarOpen(false);}}>About the ICAA</a></li>
                    <li><a href="#" onClick={() => {setActiveSection('about-sport'); setSidebarOpen(false);}}>About the Sport</a></li>
                    <li><a href="#" onClick={() => {setActiveSection('our-communities'); setSidebarOpen(false);}}>The Alliance</a></li>
                    <li><a href="#" onClick={() => {setActiveSection('events-section'); setSidebarOpen(false);}}>Events</a></li>
                    <li><a href="#" onClick={() => {setActiveSection('leadership-section'); setSidebarOpen(false);}}>Our Leadership</a></li>
                    <li><a href="#" onClick={() => {setActiveSection('contact'); setSidebarOpen(false);}}>Contact Us</a></li>
                </ul>
            </nav>
            <div className="content-overlay"></div>
            <button className="menu-toggle" id="menu-toggle-btn" onClick={toggleSidebar}>☰</button>

            <main className="main-content">
                <header id="hero-section" className="content-section active">
                    <h1 className="hero-title">International Combat Archery Alliance</h1>
                    <p className="hero-tagline">Building a global alliance for the sport of Combat Archery.</p>
                    <a href="#" onClick={() => setActiveSection('registration-section')} className="cta-button">Join the Alliance</a>
                    <div className="image-rotator-container">
                        <button id="prev-btn" className="rotator-btn" onClick={changeImage}>❮</button>
                        <img id="rotator-img" src={images[currentImageIndex]} alt="Rotating image of combat archery" className="rotator-img" />
                        <button id="next-btn" className="rotator-btn" onClick={changeImage}>❯</button>
                    </div>
                    <div className="events-news-grid">
                        <div className="news-updates-container">
                            <h3 className="news-title">Latest News</h3>
                            <ul>
                                <li><a href="#" onClick={() => setActiveSection('news-item-1')}>ICAA Partners with Top Combat Archery Gear Company</a></li>
                                <li><a href="#" onClick={() => setActiveSection('news-item-2')}>New Official Rules to be Announced for 2026 Season</a></li>
                                <li><a href="#" onClick={() => setActiveSection('news-item-3')}>Boston International Championship: Recap and Results</a></li>
                            </ul>
                        </div>
                        <div className="upcoming-events-container">
                            <h3 className="events-title">Upcoming Events</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Event Name</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><a href="#" onClick={() => setActiveSection('boston-championship')}>Boston International Championship</a></td>
                                        <td>October 25, 2025</td>
                                        <td>Archery Games Boston, Chelsea MA</td>
                                    </tr>
                                    <tr>
                                        <td><a href="#" onClick={() => setActiveSection('catch-2026')}>C.A.T.C.H. 2026</a></td>
                                        <td>June 2026</td>
                                        <td>Location TBD</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </header>

                <section id="about-icaa" className="content-section">
                    <h2 className="section-title">About the ICAA</h2>
                    <div className="content-wrapper">
                        <div className="mission-vision">
                            <h3>Our Mission</h3>
                            <p>To build a global alliance of Combat Archery players and organizers, dedicated to the unified growth and promotion of the sport.</p>
                            <h3>Our Vision</h3>
                            <p>To be the central, trusted hub for Combat Archery, fostering its growth from a niche hobby into a recognized, accessible sport.</p>
                        </div>
                    </div>
                </section>

                <section id="about-sport" className="content-section">
                    <h2 className="section-title">The Sport: Combat Archery</h2>
                    <div className="content-wrapper">
                        <p>Combat Archery is an intense, team-based sport that blends the fast-paced, elimination-style action of dodgeball with the timeless skill of archery. Wielding safe, foam-tipped arrows, players must rely on communication, movement, and sharp team strategy to eliminate their opponents. It's a thrilling game where coordinated teamplay and precision are the keys to victory.</p>
                        <img src="images/Rotating Archery Photos/2.jpg" alt="Combat Archery in action" className="sport-photo" />
                        <div className="official-rules-link">
                            <a href="#" onClick={() => setActiveSection('official-rules')} className="rules-btn">Official Rules</a>
                        </div>
                    </div>
                </section>

                <section id="official-rules" className="content-section rules-page">
                    <button className="back-btn" onClick={() => setActiveSection('about-sport')}>← Back to About the Sport</button>
                    <h2 className="section-title">Official Rules</h2>
                    <div className="content-wrapper">
                        <iframe src="https://docs.google.com/document/d/1DsiUtnoZP-xqftqtjGLf3rEP-6QpQr2M0NuTydMH-gE/preview"
                            style={{ width: '100%', height: '750px', border: 0 }}>
                        </iframe>
                    </div>
                </section>

                <section id="our-communities" className="content-section communities-section">
                    <h2 className="section-title">The Alliance</h2>
                    <ArcheryMap />
                    <div className="content-wrapper community-grid">

                        <div id="agb-card" className="community-card">
                            <a href="https://www.archerygamesboston.com/" target="_blank" rel="noopener noreferrer">
                                <img src="images/logos/AG-Boston.avif" alt="Archery Games Boston Logo" className="community-logo" />
                                <h3>Archery Games Boston</h3>
                                <p>Chelsea, MA, United States</p>
                            </a>
                            <div className="community-links">
                                <a href="https://docs.google.com/spreadsheets/d/1EiXynEr0tKIWkiXhIuJtLPGbSmtx5TqccVkJHpQ1dzU/edit?usp=drivesdk" target="_blank" rel="noopener noreferrer">League Statistics</a>
                                <a href="https://sites.google.com/d/10DF8kWQJicNYqm3y11i7lp1hS5vylWi-/p/1V2AA4wpcmY2sx59hoC0B8dk48WU9OgzX/edit?pli=1" target="_blank" rel="noopener noreferrer">League Website</a>
                            </div>
                        </div>

                        <a id="ago-card" href="https://www.archerygames.ca/" className="community-card" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/AG-Ottawa.avif" alt="Archery Games Ottawa Logo" className="community-logo" />
                            <h3>Archery Games Ottawa</h3>
                            <p>Ottawa, ON, Canada</p>
                        </a>

                        <a id="agd-card" href="https://archerygamesdenver.com/" className="community-card" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/AG-Ottawa.avif" alt="Archery Games Denver Logo" className="community-logo" />
                            <h3>Archery Games Denver</h3>
                            <p>Arvada, CO, United States</p>
                        </a>

                        <a id="cda-card" href="https://combatdarchers.ca/en/combat-archery/" className="community-card" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/Combat d' Archers.png" alt="Combat d'Archers Logo" className="community-logo-alt" />
                            <h3>Combat d'Archers</h3>
                            <p>Montréal, QC, Canada</p>
                        </a>

                        <a id="cdas-card" href="https://combatdarcherssherbrooke.ca/en/booking-combat-archery/" className="community-card" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/Combat d' Archers.png" alt="Combat d'Archers Sherbrooke Logo" className="community-logo-alt" />
                            <h3>Combat d'Archers Sherbrooke</h3>
                            <p>Sherbrooke, QC, Canada</p>
                        </a>

                        <a id="aa-card" href="https://archersarena.com/" className="community-card" target="_blank" rel="noopener noreferrer">
                            <img src="images/logos/Archers Arena.PNG" alt="Archers Arena Logo" className="community-logo" />
                            <h3>Archers Arena</h3>
                            <p>Toronto, ON, Canada</p>
                        </a>

                    </div>
                </section>

                <section id="events-section" className="content-section events-section">
                    <h2 className="section-title">Events</h2>
                    <div className="content-wrapper">
                        <a href="#" onClick={() => setActiveSection('event-registration')} className="event-register-btn-top">Register for an Event</a>
                        <div className="event-grid">
                            <a href="#" data-event="catch-2025" className="event-card">
                                <img src="images/logos/catch 2025.png" alt="C.A.T.C.H. 2025 Logo" className="event-logo" />
                                <h3>C.A.T.C.H 2025</h3>
                                <p>Somerville, MA</p>
                                <p>June 18th, 2025</p>
                            </a>

                            <a href="#" data-event="boston-play-ins" className="event-card">
                                <img src="images/logos/boston 2025.png" alt="Boston International Championship Logo" className="event-logo" />
                                <h3>Boston Play In Tournament</h3>
                                <p>Archery Games Boston, Chelsea, MA</p>
                                <p>September 6th, 2025</p>
                            </a>

                            <a href="#" data-event="boston-championship" className="event-card">
                                <img src="images/logos/boston 2025.png" alt="Boston International Championship Logo" className="event-logo" />
                                <h3>Boston International Championship</h3>
                                <p>Archery Games Boston, Chelsea, MA</p>
                                <p>October 25th, 2025</p>
                            </a>

                            <a href="#" data-event="catch-2026" className="event-card">
                                <img src="images/logos/catch 2026.png" alt="C.A.T.C.H. 2026 Logo" className="event-logo" />
                                <h3>C.A.T.C.H. 2026</h3>
                                <p>Location TBD</p>
                                <p>Date TBD</p>
                            </a>
                        </div>
                    </div>
                </section>

                <section id="event-registration" className="content-section event-registration-section">
                    <button className="back-btn" onClick={() => setActiveSection('events-section')}>← Back to Events</button>
                    <h2 className="section-title">Event Registration</h2>
                    <div className="content-wrapper">
                        <form id="event-registration-form" className="event-registration-form">
                            <label htmlFor="event-select">Event Name *</label>
                            <select id="event-select" name="event_name" required>
                                <option value="">-- Select an Event --</option>
                                <option value="catch-2025">C.A.T.C.H 2025</option>
                                <option value="boston-play-ins">Boston Play In Tournament</option>
                                <option value="boston-championship">Boston International Championship</option>
                                <option value="catch-2026">C.A.T.C.H. 2026</option>
                            </select>

                            <label htmlFor="registration-type">Registration Type *</label>
                            <select id="registration-type" name="registration_type" required>
                                <option value="">-- Select a Type --</option>
                                <option value="team">Team Registration</option>
                                <option value="free-agent">Free Agent</option>
                            </select>

                            <div id="team-fields" className="form-group">
                                <label htmlFor="team-name">Team Name *</label>
                                <input type="text" id="team-name" name="team_name" />
                                <span className="error-message">This field is required</span>

                                <label htmlFor="team-city">Home City *</label>
                                <input type="text" id="team-city" name="team_city" />
                                <span className="error-message">This field is required</span>

                                <label>Roster (8 Players) *</label>
                                <div className="roster-table" id="roster-fields">
                                </div>
                            </div>

                            <div id="free-agent-fields" className="form-group">
                                <label htmlFor="free-agent-name">Name *</label>
                                <input type="text" id="free-agent-name" name="free_agent_name" />
                                <span className="error-message">This field is required</span>

                                <label htmlFor="free-agent-city">Home City *</label>
                                <input type="text" id="free-agent-city" name="free_agent_city" />
                                <span className="error-message">This field is required</span>

                                <label htmlFor="free-agent-experience">Experience *</label>
                                <textarea id="free-agent-experience" name="free_agent_experience" rows={5}></textarea>
                                <span className="error-message">This field is required</span>
                            </div>

                            <button type="submit" className="submit-btn">Submit</button>
                        </form>
                    </div>
                </section>

                <section id="news-item-1" className="content-section news-page">
                    <button className="back-btn" onClick={() => setActiveSection('hero-section')}>← Back to Home</button>
                    <h2 className="section-title">ICAA Partners with Top Combat Archery Gear Company</h2>
                    <div className="content-wrapper">
                        <p>Full article about the new partnership will be displayed here.</p>
                    </div>
                </section>

                <section id="news-item-2" className="content-section news-page">
                    <button className="back-btn" onClick={() => setActiveSection('hero-section')}>← Back to Home</button>
                    <h2 className="section-title">New Official Rules to be Announced for 2026 Season</h2>
                    <div className="content-wrapper">
                        <p>Full article about the upcoming rule changes will be displayed here.</p>
                    </div>
                </section>

                <section id="news-item-3" className="content-section news-page">
                    <button className="back-btn" onClick={() => setActiveSection('hero-section')}>← Back to Home</button>
                    <h2 className="section-title">Boston International Championship: Recap and Results</h2>
                    <div className="content-wrapper">
                        <p>Full article with a recap and results from the tournament will be displayed here.</p>
                    </div>
                </section>

                <section id="catch-2025" className="content-section event-page">
                    <button className="back-btn" onClick={() => setActiveSection('events-section')}>← Back to Events</button>
                    <h2 className="section-title">C.A.T.C.H 2025</h2>
                    <div className="content-wrapper">
                        <img src="images/logos/catch 2025.png" className="event-page-logo" />
                        <h2>Event Details</h2>
                        <p><strong>Date:</strong> June 2025</p>
                        <p><strong>Location:</strong> Somerville, MA</p>
                        <p>Details about this inaugural event will be posted here.</p>
                    </div>
                    <a href="#" data-section="event-registration" className="event-register-btn-top">Register for this Event</a>
                </section>
                <section id="boston-play-ins" className="content-section event-page">
                    <button className="back-btn" onClick={() => setActiveSection('events-section')}>← Back to Events</button>
                    <h2 className="section-title">Boston Play Ins Tournament</h2>
                    <div className="content-wrapper">
                        <img src="images/logos/boston 2025.png" className="event-page-logo" />
                        <h2>Event Details</h2>
                        <p><strong>Date:</strong> September 6th, 2025</p>
                        <p><strong>Location:</strong> Archery Games Boston, Chelsea, MA</p>
                        <p>Details about the Boston Play Ins Tournament will be posted here.</p>
                    </div>
                    <a href="#" data-section="event-registration" className="event-register-btn-top">Register for this Event</a>
                </section>

                <section id="boston-championship" className="content-section event-page">
                    <button className="back-btn" onClick={() => setActiveSection('events-section')}>← Back to Events</button>
                    <h2 className="section-title">Boston International Championship</h2>
                    <div className="content-wrapper">
                        <img src="images/logos/boston 2025.png" className="event-page-logo" />
                        <h2>Event Details</h2>
                        <p><strong>Date:</strong> October 25, 2025</p>
                        <p><strong>Location:</strong> Archery Games Boston, Chelsea, MA</p>
                        <p>Details about the first-ever Boston International Championship will be posted here.</p>
                    </div>
                    <a href="#" data-section="event-registration" className="event-register-btn-top">Register for this Event</a>
                </section>

                <section id="catch-2026" className="content-section event-page">
                    <button className="back-btn" onClick={() => setActiveSection('events-section')}>← Back to Events</button>
                    <h2 className="section-title">C.A.T.C.H. 2026</h2>
                    <div className="content-wrapper">
                        <img src="images/logos/catch 2026.png" className="event-page-logo" />
                        <h2>Event Details</h2>
                        <p><strong>Date:</strong> June 2026</p>
                        <p><strong>Location:</strong> Location TBD</p>
                        <p>Details about the C.A.T.C.H. 2026 tournament will be posted here as they become available.</p>
                    </div>
                    <a href="#" data-section="event-registration" className="event-register-btn-top">Register for this Event</a>
                </section>

                <section id="registration-section" className="content-section registration-section">
                    <h2 className="section-title">Registration</h2>
                    <div className="content-wrapper">
                        <RegistrationForm onRegister={() => setActiveSection('registrations-table-section')} />
                        <div className="registrations-link">
                            <a href="#" onClick={() => setActiveSection('registrations-table-section')} className="small-btn">View Registrations</a>
                        </div>
                    </div>
                </section>

                <section id="registrations-table-section" className="content-section registrations-table-section">
                    <button className="back-btn" onClick={() => setActiveSection('registration-section')}>← Back to Registration</button>
                    <h2 className="section-title">Registrations</h2>
                    <div className="content-wrapper">
                        <RegistrationsTable />
                    </div>
                </section>

                <section id="leadership-section" className="content-section">
                    <h2 className="section-title">Our Leadership</h2>
                    <div className="content-wrapper">
                        <div className="leadership-intro">
                            <p>We are a group of passionate individuals
                                who share both a love for the sport of Combat Archery
                                as well as a true and firm belief that the sport we love
                                can develop and grow into a worldwide presence</p>
                        </div>
                        <BoardMember 
                            name="Cameron Cardwell"
                            title="President/Chair"
                            email="cameron.cardwell@icaa.world"
                            headshot="images/headshots/Cameron.jpg"
                            actionshot="images/action shots/Cameron.jpg"
                        />
                        <BoardMember 
                            name="Andrew Mellen"
                            title="Clerk"
                            email="andrew.mellen@icaa.world"
                            headshot="images/headshots/Andrew.jpeg"
                            actionshot="images/action shots/Andrew.jpg"
                        />
                        <BoardMember 
                            name="Kyle Best"
                            title="Treasurer"
                            email="kyle.best@icaa.world"
                            headshot="images/headshots/Kyle.jpg"
                            actionshot="images/action shots/Kyle.jpg"
                        />
                        <BoardMember 
                            name="Timothy Ahong"
                            title="International Representative"
                            email="timothy.ahong@icaa.world"
                            headshot="images/headshots/Tim.png"
                            actionshot="images/action shots/Tim_2.jpg"
                        />
                        <BoardMember 
                            name="Yousef Hariri"
                            title="Community & Mission Ambassador"
                            email="yousef.hariri@icaa.world"
                            headshot="images/headshots/Yousef.jpg"
                            actionshot="images/action shots/Yousef.jpg"
                        />
                    </div>
                </section>

                <section id="contact" className="content-section">
                    <h2 className="section-title">Contact Us</h2>
                    <div className="content-wrapper">
                        <p className="contact-text">For all inquiries, please reach out to our team at:</p>
                        <a href="mailto:info@icaa.world" className="contact-email">info@icaa.world</a>
                        <ContactForm />
                    </div>
                </section>
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
        </>
    );
};

export default App;
