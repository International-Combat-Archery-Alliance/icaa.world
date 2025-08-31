import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import RegistrationsTable from '../components/RegistrationsTable';

const RegistrationsTablePage = () => {
  useTitle('Registrations Table - ICAA');

  return (
    <section
      id="registrations-table-section"
      className="content-section registrations-table-section"
    >
      <Link to="/registration" className="back-btn">
        ← Back to Registration
      </Link>
      <div className="content-wrapper">
        <RegistrationsTable />
      </div>
    </section>
  );
};

export default RegistrationsTablePage;
