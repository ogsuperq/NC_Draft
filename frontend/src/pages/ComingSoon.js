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
    description: 'Coordinating the people, schedules, and services that keep a household running smoothly.',
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
    description: 'Discreet support for travel, entertaining, and daily life.',
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
    description: 'Management of the assets that accompany exceptional living.',
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
            The Operating System
            <br />
            for <em>Exceptional Living.</em>
          </h1>
          <p className="hero-copy reveal reveal-three">
            Private estate management for homeowners who expect seamless oversight
            of their properties, vendors, and lifestyle needs.
          </p>
          <div className="hero-actions reveal reveal-four">
            <a className="button button-primary" href="#inquiry">
              Request Private Consultation
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </a>
            <a className="button button-secondary" href="#inquiry">
              Apply for Membership
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
          <h2>One trusted point of command for a life in motion.</h2>
          <p>
            We oversee the details that should never require your attention, bringing
            the rigor of a private estate office to waterfront residences, trusted
            vendors, and the daily operation of your world.
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
            “Your privacy is not a feature of our service.
            <br />
            It is the foundation.”
          </blockquote>
          <p className="trust-copy">
            Invitation-led relationships. Vetted partners. Confidential operations for
            Naples households that value privacy, continuity, and impeccable oversight.
          </p>
        </div>
      </section>

      <section className="inquiry section-shell" id="inquiry">
        <div className="inquiry-heading">
          <p className="section-label">Private Consultation</p>
          <h2>Begin a confidential conversation.</h2>
          <p>
            For Naples homeowners and select Southwest Florida clients. Introductions
            are considered personally.
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
              <span>How may we assist?</span>
              <select name="interest" defaultValue="" required>
                <option value="" disabled>Select an area of interest</option>
                <option>Estate Management</option>
                <option>Lifestyle Management</option>
                <option>Membership</option>
                <option>Private Consultation</option>
              </select>
            </label>
            <label className="form-wide">
              <span>Message</span>
              <textarea
                name="message"
                rows="4"
                placeholder="Share a brief note about how we may assist."
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
