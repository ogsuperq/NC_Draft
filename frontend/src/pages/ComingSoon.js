import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, LockKeyhole } from 'lucide-react';
import './ComingSoon.css';

const services = [
  ['01', 'Estate Operations'],
  ['02', 'Staff Coordination'],
  ['03', 'Property Oversight'],
  ['04', 'Vendor Management'],
  ['05', 'Travel & Hospitality'],
  ['06', 'Security & Privacy'],
];

const ComingSoon = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
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
          <p className="eyebrow reveal reveal-one">Private Estate Office · Naples, Florida</p>
          <h1 className="reveal reveal-two">
            The Operating System
            <br />
            for <em>Exceptional Living.</em>
          </h1>
          <p className="hero-copy reveal reveal-three">
            Private estate and lifestyle management for clients who expect seamless
            execution across every residence, asset, and experience.
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
            the rigor of a family office to the daily operation of your world.
          </p>
        </div>
      </section>

      <section className="services section-shell" aria-labelledby="services-title">
        <div className="services-intro">
          <p className="section-label">Scope of Service</p>
          <h2 id="services-title">Quietly comprehensive.</h2>
        </div>
        <div className="service-list">
          {services.map(([number, title]) => (
            <div className="service-row" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <span className="service-mark" aria-hidden="true">+</span>
            </div>
          ))}
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
            Invitation-led relationships. Vetted partners. Confidential operations
            structured around your standards and preferences.
          </p>
        </div>
      </section>

      <section className="inquiry section-shell" id="inquiry">
        <div className="inquiry-heading">
          <p className="section-label">Private Consultation</p>
          <h2>Begin a confidential conversation.</h2>
          <p>Membership is limited. Introductions are considered personally.</p>
        </div>

        {submitted ? (
          <div className="form-success" role="status">
            <Check size={22} strokeWidth={1.3} />
            <div>
              <h3>Thank you.</h3>
              <p>Your inquiry has been received. Our private office will be in touch.</p>
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
              <select name="interest" defaultValue="">
                <option value="" disabled>Select an area of interest</option>
                <option>Estate Management</option>
                <option>Lifestyle Management</option>
                <option>Membership</option>
                <option>Private Consultation</option>
              </select>
            </label>
            <button className="button button-primary form-wide" type="submit">
              Submit Private Inquiry
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </button>
          </form>
        )}
      </section>

      <footer className="public-footer">
        <div className="footer-mark">NC</div>
        <p>Neapolitan Concierge</p>
        <span>Naples · New York · Global</span>
        <small>© {new Date().getFullYear()} Neapolitan Concierge. By invitation.</small>
      </footer>
    </main>
  );
};

export default ComingSoon;
