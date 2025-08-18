import BoardMember from '../components/BoardMember';

const Leadership = () => {
    return (
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
    );
};

export default Leadership;
