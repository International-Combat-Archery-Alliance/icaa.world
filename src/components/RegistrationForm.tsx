import React, { useState } from 'react';

interface RegistrationFormProps {
    onRegister: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
    const [regType, setRegType] = useState('');
    const [groupName, setGroupName] = useState('');
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const [groupNameError, setGroupNameError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let isValid = true;

        if (fullName.trim() === '') {
            setNameError(true);
            isValid = false;
        } else {
            setNameError(false);
        }

        if (email.trim() === '') {
            setEmailError(true);
            isValid = false;
        } else {
            setEmailError(false);
        }

        if ((regType === 'member-class-1' || regType === 'member-class-2') && groupName.trim() === '') {
            setGroupNameError(true);
            isValid = false;
        } else {
            setGroupNameError(false);
        }

        if (!isValid) {
            return;
        }

        const newRegistration = {
            name: fullName,
            email: email,
            type: regType,
            groupName: groupName || 'N/A',
            location: location || 'N/A',
            phone: phone || 'N/A',
            message: message || 'N/A'
        };

        const registrations = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
        registrations.push(newRegistration);
        localStorage.setItem('icaa_registrations', JSON.stringify(registrations));

        // Reset form
        setRegType('');
        setGroupName('');
        setFullName('');
        setLocation('');
        setEmail('');
        setPhone('');
        setMessage('');

        onRegister();
    };

    return (
        <form id="registration-form" className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="reg-type">Registration Type:</label>
            <select id="reg-type" name="registration_type" required value={regType} onChange={e => setRegType(e.target.value)}>
                <option value="">-- Please select --</option>
                <option value="volunteer">Volunteer</option>
                <option value="individual-player">Individual Player</option>
                <option value="member-class-1">Official ICAA Organization Member</option>
                <option value="member-class-2">Affiliate Club Member</option>
            </select>

            {(regType === 'member-class-1' || regType === 'member-class-2') && (
                <>
                    <label id="group-name-label" htmlFor="group-name">Group Name *</label>
                    <input type="text" id="group-name" name="group_name" value={groupName} onChange={e => setGroupName(e.target.value)} className={groupNameError ? 'error-border' : ''} />
                    {groupNameError && <span id="group-name-error" className="error-message">This field is required</span>}
                </>
            )}

            <label htmlFor="full-name">Name *</label>
            <input type="text" id="full-name" name="full_name" required value={fullName} onChange={e => setFullName(e.target.value)} className={nameError ? 'error-border' : ''} />
            {nameError && <span id="name-error" className="error-message">This field is required</span>}

            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" value={location} onChange={e => setLocation(e.target.value)} />

            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required value={email} onChange={e => setEmail(e.target.value)} className={emailError ? 'error-border' : ''} />
            {emailError && <span id="email-error" className="error-message">This field is required</span>}

            <label htmlFor="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" value={phone} onChange={e => setPhone(e.target.value)} />

            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows={5} value={message} onChange={e => setMessage(e.target.value)}></textarea>

            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
};

export default RegistrationForm;
