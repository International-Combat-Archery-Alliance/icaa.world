import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

const Registration = () => {
    return (
        <section id="registration-section" className="content-section registration-section">
            <h2 className="section-title">Registration</h2>
            <div className="content-wrapper">
                <RegistrationForm />
                <div className="registrations-link">
                    <Link to="/registrations-table" className="small-btn">View Registrations</Link>
                </div>
            </div>
        </section>
    );
};

export default Registration;
