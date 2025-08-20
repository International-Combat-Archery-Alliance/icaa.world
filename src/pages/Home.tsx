import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
        <header id="hero-section" className="content-section active">
            <h1 className="hero-title">International Combat Archery Alliance</h1>
            <p className="hero-tagline">Building a global alliance for the sport of Combat Archery.</p>
            <Link to="/registration" className="cta-button">Join the Alliance</Link>
            <div className="image-rotator-container">
                <button id="prev-btn" className="rotator-btn" onClick={changeImage}>❮</button>
                <img id="rotator-img" src={images[currentImageIndex]} alt="Rotating image of combat archery" className="rotator-img" />
                <button id="next-btn" className="rotator-btn" onClick={changeImage}>❯</button>
            </div>
            <div className="events-news-grid">
                <div className="news-updates-container">
                    <h3 className="news-title">Latest News</h3>
                    <ul>
                        <li><Link to="/news/icaa-partners">ICAA Partners with Top Combat Archery Gear Company</Link></li>
                        <li><Link to="/news/new-rules">New Official Rules to be Announced for 2026 Season</Link></li>
                        <li><Link to="/news/boston-championship-recap">Boston International Championship: Recap and Results</Link></li>
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
                                <td><Link to="/events/boston-play-ins">Boston Play Ins Tournament</Link></td>
                                <td>September 6th, 2025</td>
                                <td>Archery Games Boston, Chelsea MA</td>
                            </tr>
                            <tr>
                                <td><Link to="/events/boston-championship">Boston International Championship</Link></td>
                                <td>October 25, 2025</td>
                                <td>Archery Games Boston, Chelsea MA</td>
                            </tr>
                            <tr>
                                <td><Link to="/events/catch-2026">C.A.T.C.H. 2026</Link></td>
                                <td>June 2026</td>
                                <td>Location TBD</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </header>
    );
};

export default Home;
