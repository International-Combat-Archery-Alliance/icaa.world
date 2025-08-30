import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

const Registration = () => {
  useTitle('Registration - ICAA');

  return (
    <section
      id="registration-section"
      className="content-section registration-section"
    >
      <div className="content-wrapper">
        <RegistrationForm onRegister={() => {}} />
        <div className="registrations-link">
          <Link to="/registrations-table" className="small-btn">
            View Registrations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Registration;
