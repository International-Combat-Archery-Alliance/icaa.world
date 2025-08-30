import { useTitle } from 'react-use';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  useTitle('Contact Us - ICAA');

  return (
    <section id="contact" className="content-section">
      <div className="content-wrapper">
        <p className="contact-text">
          For all inquiries, please reach out to our team at:
        </p>
        <a href="mailto:info@icaa.world" className="contact-email">
          info@icaa.world
        </a>
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
