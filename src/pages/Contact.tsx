import ContactForm from '../components/ContactForm';

const Contact = () => {
    return (
        <section id="contact" className="content-section">
            <h2 className="section-title">Contact Us</h2>
            <div className="content-wrapper">
                <p className="contact-text">For all inquiries, please reach out to our team at:</p>
                <a href="mailto:info@icaa.world" className="contact-email">info@icaa.world</a>
                <ContactForm />
            </div>
        </section>
    );
};

export default Contact;
