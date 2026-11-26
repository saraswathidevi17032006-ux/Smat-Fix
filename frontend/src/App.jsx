import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './Login.jsx'
import Register from './Register.jsx'
import Dashboard from './Dashboard.jsx'
import { loadSavedToken } from './api/apiClient.js'

// Data for the Services section (easy to update or extend later)
const SERVICES_LIST = [
  {
    id: 'electrical',
    title: 'Electrical',
    description:
      'Report broken streetlights, exposed wiring, power fluctuations, or faulty electrical poles for rapid technician dispatch.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    description:
      'Flag leaking water pipes, burst mains, clogged public drains, or low water pressure issues before they worsen.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    id: 'road-damage',
    title: 'Road Damage',
    description:
      'Submit potholes, cracked sidewalks, faded road markings, or damaged traffic signs to keep streets safe for everyone.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19L8 5" />
        <path d="M16 5l4 14" />
        <path d="M12 6v2" />
        <path d="M12 11v2" />
        <path d="M12 16v2" />
      </svg>
    ),
  },
  {
    id: 'garbage',
    title: 'Garbage Management',
    description:
      'Alert sanitation teams about overflowing public bins, missed waste collections, or illegal dumping in your neighborhood.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    ),
  },
  {
    id: 'other',
    title: 'Other Issues',
    description:
      'Need help with damaged park benches, fallen tree branches, or general maintenance hazards? Log any other local issue here.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
]

// Data for the 3-step "How It Works" workflow
const WORKFLOW_STEPS = [
  {
    number: '01',
    title: 'Report',
    description:
      'Choose a problem category, add a short description with location details, and submit your report in under a minute.',
  },
  {
    number: '02',
    title: 'Track',
    description:
      'Monitor real-time status updates as your ticket moves from review to technician assignment and active repair.',
  },
  {
    number: '03',
    title: 'Resolve',
    description:
      'Receive instant confirmation once the maintenance team completes the job and restores everything back to normal.',
  },
]

// Reusable Smart Fix Logo component
function BrandLogo({ isFooter = false }) {
  return (
    <a href="#home" className={`brand-logo ${isFooter ? 'footer-logo' : ''}`}>
      <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect width="36" height="36" rx="10" fill={isFooter ? '#06b6d4' : '#0a192f'} />
        <path
          d="M22.5 11.5a4.5 4.5 0 0 0-5.8 5.8l-5.9 5.9a1.5 1.5 0 0 0 2.1 2.1l5.9-5.9a4.5 4.5 0 0 0 5.8-5.8l-2.3 2.3-2.1-2.1 2.3-2.3z"
          fill={isFooter ? '#061021' : '#22d3ee'}
        />
      </svg>
      <span>
        Smart <span className="brand-logo-accent">Fix</span>
      </span>
    </a>
  )
}

// Top Navigation Bar
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavClick = () => {
    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="section-container navbar-inner">
        <BrandLogo />

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Navigation Links & Auth Buttons */}
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <ul className="nav-links">
            <li>
              <a href="#home" className="nav-link" onClick={handleNavClick}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="nav-link" onClick={handleNavClick}>
                About
              </a>
            </li>
            <li>
              <a href="#services" className="nav-link" onClick={handleNavClick}>
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-link" onClick={handleNavClick}>
                Contact
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setMenuOpen(false)
                navigate('/login')
              }}
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-nav-register"
              onClick={() => {
                setMenuOpen(false)
                navigate('/register')
              }}
            >
              Register
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

// Custom Maintenance & Problem-Solving SVG Illustration for the Hero
function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of Smart Fix maintenance tracking and problem resolution"
    >
      {/* Background Glow Circle */}
      <circle cx="245" cy="200" r="165" fill="#112240" stroke="#22d3ee" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="245" cy="200" r="125" fill="#0f294a" stroke="#22d3ee" strokeOpacity="0.14" strokeDasharray="6 6" strokeWidth="1.5" />

      {/* Main Dashboard Card */}
      <rect x="85" y="75" width="310" height="225" rx="18" fill="#ffffff" />
      <rect x="85" y="75" width="310" height="44" rx="18" fill="#0a192f" />
      <rect x="85" y="102" width="310" height="17" fill="#0a192f" />

      {/* Window Dots */}
      <circle cx="110" cy="97" r="5" fill="#22d3ee" />
      <circle cx="128" cy="97" r="5" fill="#38bdf8" fillOpacity="0.55" />
      <circle cx="146" cy="97" r="5" fill="#94a3b8" fillOpacity="0.45" />
      <text x="172" y="101" fill="#e2e8f0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
        Smart Fix Live Tracker
      </text>

      {/* Ticket Row 1 - Resolved */}
      <rect x="106" y="136" width="268" height="44" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="130" cy="158" r="12" fill="#ecfeff" />
      <path d="M125 158l3.5 3.5 6.5-7" stroke="#0891b2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="152" y="148" width="110" height="8" rx="4" fill="#0a192f" />
      <rect x="152" y="162" width="74" height="6" rx="3" fill="#94a3b8" />
      <rect x="295" y="149" width="66" height="18" rx="9" fill="#cffafe" />
      <text x="307" y="161" fill="#0891b2" fontSize="10" fontWeight="700" fontFamily="sans-serif">
        Resolved
      </text>

      {/* Ticket Row 2 - In Progress */}
      <rect x="106" y="190" width="268" height="44" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="130" cy="212" r="12" fill="#e0f2fe" />
      <path d="M131 205l-5 8h4l-1 6 5-8h-4l1-6z" fill="#0284c7" />
      <rect x="152" y="202" width="122" height="8" rx="4" fill="#0a192f" />
      <rect x="152" y="216" width="84" height="6" rx="3" fill="#94a3b8" />
      <rect x="295" y="203" width="66" height="18" rx="9" fill="#0a192f" />
      <text x="308" y="215" fill="#22d3ee" fontSize="10" fontWeight="700" fontFamily="sans-serif">
        Active
      </text>

      {/* Progress Bar */}
      <rect x="106" y="250" width="268" height="32" rx="10" fill="#f1f5f9" />
      <rect x="118" y="262" width="165" height="8" rx="4" fill="#06b6d4" />
      <rect x="295" y="262" width="64" height="8" rx="4" fill="#cbd5e1" />

      {/* Floating Wrench Badge (Bottom Left) */}
      <g>
        <rect x="42" y="245" width="92" height="86" rx="16" fill="#06b6d4" />
        <path
          d="M99 272a11 11 0 0 0-14 14l-13 13a3.5 3.5 0 0 0 5 5l13-13a11 11 0 0 0 14-14l-5.5 5.5-5-5 5.5-5.5z"
          fill="#061021"
        />
      </g>

      {/* Floating Verified Gear Badge (Top Right) */}
      <g>
        <rect x="348" y="42" width="86" height="82" rx="16" fill="#112240" stroke="#22d3ee" strokeWidth="2" />
        <circle cx="391" cy="83" r="18" stroke="#22d3ee" strokeWidth="3" />
        <path d="M383 83l5.5 5.5 11-11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

// Hero Section
function HeroSection({ onActionClick }) {
  return (
    <section id="home" className="hero-section">
      <div className="section-container hero-grid">
        <div>
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Smart Problem Reporting &amp; Resolution
          </div>

          <h1 className="hero-title">
            Report Problems. <span className="hero-title-highlight">Get Them Fixed.</span>
          </h1>

          <p className="hero-description">
            Smart Fix bridges the gap between citizens and maintenance teams. Submit electrical, plumbing, road, or
            sanitation issues in seconds, track live repair progress, and build a cleaner, safer community.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onActionClick('Report a Problem')}
            >
              Report a Problem
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <a href="#services" className="btn btn-secondary">
              Explore Services
            </a>
          </div>

          <div className="hero-highlights">
            <div className="hero-highlight-item">
              <svg className="hero-highlight-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Quick Issue Logging
            </div>
            <div className="hero-highlight-item">
              <svg className="hero-highlight-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Live Repair Tracking
            </div>
            <div className="hero-highlight-item">
              <svg className="hero-highlight-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified Resolution
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="section-padding about-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">About Smart Fix</span>
          <h2 className="section-title">Built for Faster, Smarter Civic Maintenance</h2>
          <p className="section-subtitle">
            Instead of phone calls and lost paperwork, Smart Fix gives everyone a single transparent platform to report
            issues and follow every repair until completion.
          </p>
        </div>

        <div className="about-grid">
          <article className="about-card">
            <div className="about-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Save Time Reporting</h3>
            <p>Log maintenance problems from any device in under 60 seconds without waiting on hold.</p>
          </article>

          <article className="about-card">
            <div className="about-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3>Accurate Dispatch</h3>
            <p>Categorized tickets ensure the right electrical, plumbing, or road crew gets assigned immediately.</p>
          </article>

          <article className="about-card">
            <div className="about-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Full Transparency</h3>
            <p>Clear status milestones keep residents informed from initial submission to verified resolution.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

// Services Section
function ServicesSection({ onActionClick }) {
  return (
    <section id="services" className="section-padding services-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Problems We Help You Fix</h2>
          <p className="section-subtitle">
            Select from five dedicated maintenance categories so your report reaches the right team right away.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES_LIST.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-icon-wrapper">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <button
                type="button"
                className="service-link-btn"
                onClick={() => onActionClick(`${service.title} Report`)}
              >
                Report {service.title}
                <span aria-hidden="true">&rarr;</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding how-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Three Simple Steps to Resolution</h2>
          <p className="section-subtitle">
            Our streamlined workflow makes reporting and resolving neighborhood issues effortless.
          </p>
        </div>

        <div className="steps-grid">
          {WORKFLOW_STEPS.map((step) => (
            <article key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact & Call-to-Action Section
function ContactSection({ onActionClick }) {
  return (
    <section id="contact" className="section-padding contact-section">
      <div className="section-container">
        <div className="contact-banner">
          <div>
            <h2>Need Assistance or Ready to Report an Issue?</h2>
            <p>
              Spot a maintenance issue in your area? Submit a report right away or reach out to the Smart Fix support
              desk for urgent civic assistance.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onActionClick('Report a Problem')}
            >
              Report a Problem Now
            </button>
          </div>

          <div className="contact-details-card">
            <div className="contact-item">
              <svg className="contact-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>support@smartfix.com</span>
            </div>
            <div className="contact-item">
              <svg className="contact-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+1 (800) 555-0199</span>
            </div>
            <div className="contact-item">
              <svg className="contact-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Mon &ndash; Sat: 8:00 AM &ndash; 8:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Professional Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          <div>
            <BrandLogo isFooter />
            <p className="footer-brand-text">
              Smart Fix &ndash; Smart Problem Reporting and Resolution System for cleaner, safer, and better-maintained
              communities.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><a href="#services">Electrical</a></li>
              <li><a href="#services">Plumbing</a></li>
              <li><a href="#services">Road Damage</a></li>
              <li><a href="#services">Garbage Management</a></li>
              <li><a href="#services">Other Issues</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact Support</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@smartfix.com">support@smartfix.com</a></li>
              <li><a href="tel:+18005550199">+1 (800) 555-0199</a></li>
              <li><span>City Maintenance Hub, Suite 200</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Smart Fix. All rights reserved.</p>
          <p>Built with React.js &amp; CSS</p>
        </div>
      </div>
    </footer>
  )
}

// Existing Home Page Component
function HomePage() {
  const navigate = useNavigate()
  const [activeModal, setActiveModal] = useState('')

  useEffect(() => {
    document.title = 'Smart Fix – Smart Problem Reporting and Resolution System'
  }, [])

  const handleActionClick = (actionName) => {
    if (loadSavedToken()) {
      navigate('/dashboard')
      return
    }
    setActiveModal(actionName)
  }

  return (
    <div className="app-container">
      <Navbar />

      <main>
        <HeroSection onActionClick={handleActionClick} />
        <AboutSection />
        <ServicesSection onActionClick={handleActionClick} />
        <HowItWorksSection />
        <ContactSection onActionClick={handleActionClick} />
      </main>

      <Footer />

      {/* Prompt unauthenticated users to log in or register before reporting */}
      {activeModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setActiveModal('')}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <span className="modal-badge">Sign In Required</span>
            <h3 id="modal-title">{activeModal}</h3>
            <p>
              Please log in or create a Smart Fix account to submit your <strong>{activeModal}</strong> and track
              live repair updates on your dashboard.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setActiveModal('')
                  navigate('/login')
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setActiveModal('')
                  navigate('/register')
                }}
              >
                Register
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveModal('')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Protected route: redirect to /login if no token is stored
function ProtectedRoute({ children }) {
  const token = loadSavedToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Main App Router
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
