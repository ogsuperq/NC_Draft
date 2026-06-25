import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, LoaderCircle, LockKeyhole } from 'lucide-react';
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
          <span className="monogram">NC</span>
          <span className="wordmark-text">
            <strong>Neapolitan</strong>
            <small>Concierge</small>
          </span>
        </a>
        <a className="header-link" href="#inquiry">
          Private inquiries
          <ArrowUpRight size={14} strokeWidth={1.4} />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <p className="eyebrow reveal reveal-one">Private Estate Office · Naples Waterfront Estates</p>
          <h1 className="reveal reveal-two">
            A Private Estate Office{' '}
            <br />
            for <em>Exceptional Homes.</em>
          </h1>
          <p className="hero-copy reveal reveal-three">
            Estate and lifestyle management for homeowners who expect oversight,
            readiness, and continuity across every residence, vendor, and arrival.
          </p>
          <div className="hero-actions reveal reveal-four">
            <a className="button button-primary" href="#inquiry">
              Request Private Consultation
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </a>
            <a className="button button-secondary" href="#inquiry">
              Discuss Estate Oversight
            </a>
          </div>
          <p className="hero-location reveal reveal-five">
            Serving Naples, Port Royal, Aqualane Shores, Old Naples, and select private
            clients throughout Southwest Florida.
          </p>
        </div>

        <a className="scroll-cue" href="#office" aria-label="Discover more">
          <span>Discover</span>
          <ArrowDown size={15} strokeWidth={1.2} />
        </a>
      </section>

      <section className="positioning section-shell" id="office">
        <p className="section-label">The Private Office</p>
        <div className="positioning-copy">
          <h2>One trusted point of coordination for a life in motion.</h2>
          <p>
            We bring the discipline of a private estate office to waterfront residences,
            trusted providers, household logistics, and the daily rhythm of life in Naples.
          </p>
        </div>
      </section>

      <section className="modern-office section-shell" aria-labelledby="modern-office-title">
        <p className="section-label">The Modern Private Estate Office</p>
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

      <section className="services section-shell" aria-labelledby="services-title">
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
            For Naples homeowners seeking a private estate office model for oversight,
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
