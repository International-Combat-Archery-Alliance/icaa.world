import { useEffect, useState } from 'react';

interface Registration {
  name: string;
  email: string;
  type: string;
  groupName: string;
  location: string;
  phone: string;
  message: string;
}

const RegistrationsTable = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = () => {
    const storedRegistrations: Registration[] = JSON.parse(
      localStorage.getItem('icaa_registrations') || '[]',
    );
    setRegistrations(storedRegistrations);
  };

  return (
    <table id="registrations-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Type</th>
          <th>Group Name</th>
          <th>Location</th>
          <th>Phone</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {registrations.map((reg, index) => (
          <tr key={index}>
            <td>{reg.name}</td>
            <td>{reg.email}</td>
            <td>{reg.type}</td>
            <td>{reg.groupName}</td>
            <td>{reg.location}</td>
            <td>{reg.phone}</td>
            <td>{reg.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RegistrationsTable;
