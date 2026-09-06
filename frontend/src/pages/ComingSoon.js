import React, { useState } from 'react';
import { ArrowUpRight, Check, LoaderCircle, LockKeyhole } from 'lucide-react';
import estateInteriorImage from '../assets/images/naples-estate-interior-v2.png';
import './ComingSoon.css';

const services = [
  {
    number: '01',
    title: 'Estate Management',
    description: 'Oversight and coordination for exceptional residences.',
    details: [
      'Property inspections',
      'Maintenance coordination',
      'Vendor oversight',
      'Hurricane readiness',
      'Project supervision',
    ],
  },
  {
    number: '02',
    title: 'Household Administration',
    description: 'Continuity across the people, schedules, and household logistics behind daily estate life.',
    details: [
      'Staff coordination',
      'Scheduling',
      'Deliveries',
      'Guest preparation',
      'Household logistics',
    ],
  },
  {
    number: '03',
    title: 'Lifestyle Coordination',
    description: 'Discreet management of travel, entertaining, arrivals, and in-residence experiences.',
    details: [
      'Travel',
      'Reservations',
      'Entertaining',
      'Guest services',
      'Local experiences',
    ],
  },
  {
    number: '04',
    title: 'Asset Oversight',
    description: 'Coordination for the assets and specialist providers that accompany exceptional homes.',
    details: [
      'Yacht coordination',
      'Vehicle services',
      'Aviation support',
      'Specialty vendors',
    ],
  },
];

const ComingSoon = () => {
  const [formStatus, setFormStatus] = useState('idle');
  const [formError, setFormError] = useState('');
  const [openService, setOpenService] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('submitting');
    setFormError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          interest: formData.get('interest'),
          message: formData.get('message'),
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJsonResponse = contentType.includes('application/json');
      const result = isJsonResponse ? await response.json() : {};

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.error
          || 'The private inquiry service could not be reached. Please try again shortly.'
        );
      }

      form.reset();
      setFormStatus('success');
    } catch (error) {
      setFormError(
        error.message || 'We could not deliver your inquiry. Please try again in a moment.'
      );
      setFormStatus('error');
    }
  };

  return (
    <main className="coming-soon">
      <header className="public-header">
        <a className="wordmark" href="#top" aria-label="Neapolitan Concierge home">
          <span className="monogram" aria-hidden="true">
            <span>N</span>
            <span>C</span>
          </span>
          <span className="wordmark-text">
            <strong>Neapolitan Concierge</strong>
            <small>Private Estate Curator</small>
          </span>
        </a>
        <nav className="public-nav" aria-label="Public navigation">
          <a href="#office">Our approach</a>
          <a href="#services">Services</a>
          <a href="#office">About</a>
          <a href="#inquiry">Contact</a>
        </nav>
        <a className="header-link" href="#inquiry">
          <span className="header-link-desktop">Private inquiry</span>
          <span className="header-link-mobile">Inquire</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow reveal reveal-one">Exceptional homes. A more curated life.</p>
          <h1 className="reveal reveal-two">
            A Private Estate Curator
            <br />
            for Life in Naples.
          </h1>
          <p className="hero-copy reveal reveal-three">
            Discreet, deeply local stewardship for your private world, with every detail
            considered.
          </p>
          <div className="hero-actions reveal reveal-four">
            <a className="button button-primary" href="#inquiry">
              Inquire now
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </a>
          </div>
        </div>

        <div className="hero-signature" aria-hidden="true">
          <span>Homes</span>
          <span>Lifestyle</span>
          <span>Assets</span>
          <span>Naples</span>
        </div>
      </section>

      <div className="curator-strip" aria-label="Private estate curator scope">
        <div><span>01</span><strong>Estate Management</strong></div>
        <div><span>02</span><strong>Household Administration</strong></div>
        <div><span>03</span><strong>Lifestyle Coordination</strong></div>
        <div><span>04</span><strong>Asset Oversight</strong></div>
      </div>

      <section className="positioning" id="office">
        <div className="positioning-image" aria-hidden="true">
          <img src={estateInteriorImage} alt="" />
        </div>
        <div className="positioning-copy">
          <p className="section-label">A more considered way</p>
          <h2>Quietly comprehensive.<br />Always personal.</h2>
          <p>
            A considered presence behind the private world you have built, so life in Naples
            feels as effortless as it appears.
          </p>
          <a className="positioning-link" href="#services">
            Our approach
            <ArrowUpRight size={15} strokeWidth={1.3} />
          </a>
        </div>
      </section>

      <section className="modern-office section-shell" aria-labelledby="modern-office-title">
        <p className="section-label">The Modern Private Estate Curator</p>
        <div className="modern-office-copy">
          <h2 id="modern-office-title">Continuity across residences, providers, and plans.</h2>
          <p>
            Today’s homeowners often move between residences, service providers, projects,
            travel schedules, and household logistics. Neapolitan Concierge serves as a
            single point of coordination, providing discreet oversight and continuity
            across estate and lifestyle management.
          </p>
        </div>
      </section>

      <section className="services section-shell" id="services" aria-labelledby="services-title">
        <div className="services-intro">
          <p className="section-label">Scope of Service</p>
          <h2 id="services-title">Quietly comprehensive.</h2>
        </div>
        <div className="service-list">
          {services.map((service, index) => {
            const isOpen = openService === index;
            const panelId = `service-panel-${index}`;
            const buttonId = `service-trigger-${index}`;

            return (
              <div className="service-item" key={service.title} data-open={isOpen}>
                <button
                  id={buttonId}
                  className="service-row"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenService(isOpen ? null : index)}
                >
                  <span className="service-number">{service.number}</span>
                  <span className="service-summary">
                    <span className="service-title">{service.title}</span>
                    <span className="service-description">{service.description}</span>
                  </span>
                  <span className="service-mark" aria-hidden="true">+</span>
                </button>
                <div
                  id={panelId}
                  className="service-panel"
                  role="region"
                  aria-labelledby={buttonId}
                >
                  <ul>
                    {service.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="trust">
        <div className="trust-inner">
          <LockKeyhole size={24} strokeWidth={1.1} />
          <p className="section-label">Discretion by Design</p>
          <blockquote>
            “Your privacy is not a feature of our service.{' '}
            <br />
            It is the foundation.”
          </blockquote>
          <p className="trust-copy">
            Invitation-led relationships. Vetted providers. Confidential oversight for
            Naples households that value privacy, continuity, and considered execution.
          </p>
        </div>
      </section>

      <section className="inquiry section-shell" id="inquiry">
        <div className="inquiry-heading">
          <p className="section-label">Private Consultation</p>
          <h2>Begin a confidential conversation.</h2>
          <p>
            For Naples homeowners seeking a private estate curator for oversight,
            readiness, and continuity.
          </p>
        </div>

        {formStatus === 'success' ? (
          <div className="form-success" role="status">
            <Check size={22} strokeWidth={1.3} />
            <div>
              <h3>Thank you.</h3>
              <p>
                Your private inquiry has been received. A member of our office will
                respond with discretion.
              </p>
            </div>
          </div>
        ) : (
          <form className="inquiry-form" onSubmit={handleSubmit}>
            <label>
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="form-wide">
              <span>Area of oversight</span>
              <select name="interest" defaultValue="" required>
                <option value="" disabled>Select an area of focus</option>
                <option>Estate Management</option>
                <option>Household Administration</option>
                <option>Lifestyle Coordination</option>
                <option>Asset Oversight</option>
                <option>Private Consultation</option>
              </select>
            </label>
            <label className="form-wide">
              <span>Message</span>
              <textarea
                name="message"
                rows="4"
                placeholder="Share what your estate office should understand."
                required
              />
            </label>
            {formStatus === 'error' && (
              <p className="form-error form-wide" role="alert">
                {formError}
              </p>
            )}
            <button
              className="button button-primary form-wide"
              type="submit"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? (
                <>
                  Sending Private Inquiry
                  <LoaderCircle className="form-spinner" size={16} strokeWidth={1.4} />
                </>
              ) : (
                <>
                  Submit Private Inquiry
                  <ArrowUpRight size={16} strokeWidth={1.4} />
                </>
              )}
            </button>
          </form>
        )}
      </section>

      <footer className="public-footer">
        <div className="footer-mark">NC</div>
        <p>Neapolitan Concierge</p>
        <span>Naples · Port Royal · Southwest Florida</span>
        <small>© {new Date().getFullYear()} Neapolitan Concierge. By invitation.</small>
      </footer>
    </main>
  );
};

export default ComingSoon;
