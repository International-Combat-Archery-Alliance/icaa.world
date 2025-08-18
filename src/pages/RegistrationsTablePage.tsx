import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationsTable from '../components/RegistrationsTable';

const RegistrationsTablePage = () => {
    return (
        <section id="registrations-table-section" className="content-section registrations-table-section">
            <Link to="/registration" className="back-btn">← Back to Registration</Link>
            <h2 className="section-title">Registrations</h2>
            <div className="content-wrapper">
                <RegistrationsTable />
            </div>
        </section>
    );
};

export default RegistrationsTablePage;
