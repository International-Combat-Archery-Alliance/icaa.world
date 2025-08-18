import React, { useState } from 'react';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && message) {
            setIsSubmitted(true);
        } else {
            alert('Please fill in all fields.');
        }
    };

    if (isSubmitted) {
        return (
            <div className="confirmation-message">
                <h3>Thank you for your message!</h3>
                <p>We will get back to you soon.</p>
                <button className="confirm-btn" onClick={() => setIsSubmitted(false)}>Acknowledge</button>
            </div>
        );
    }

    return (
        <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)} />
            <input type="email" name="email" placeholder="Your Email" required value={email} onChange={e => setEmail(e.target.value)} />
            <textarea name="message" placeholder="Your Message" required value={message} onChange={e => setMessage(e.target.value)}></textarea>
            <button type="submit">Send Message</button>
        </form>
    );
};

export default ContactForm;
