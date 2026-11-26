import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, saveAuthData } from './api/apiClient.js'
import './Register.css'

// Registration illustration (matches Login.jsx style)
function RegisterIllustration() {
  return (
    <svg
      className="register-illustration"
      viewBox="0 0 420 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of Smart Fix citizen registration and community maintenance"
    >
      {/* Background Rings */}
      <circle cx="210" cy="160" r="132" fill="#0f294a" stroke="#22d3ee" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="210" cy="160" r="100" fill="#112240" stroke="#22d3ee" strokeOpacity="0.16" strokeDasharray="6 6" strokeWidth="1.5" />

      {/* Profile card */}
      <rect x="80" y="56" width="260" height="192" rx="18" fill="#ffffff" />
      <rect x="80" y="56" width="260" height="40" rx="18" fill="#0a192f" />
      <rect x="80" y="80" width="260" height="16" fill="#0a192f" />
      <circle cx="104" cy="76" r="4.5" fill="#22d3ee" />
      <circle cx="120" cy="76" r="4.5" fill="#38bdf8" fillOpacity="0.55" />
      <circle cx="136" cy="76" r="4.5" fill="#94a3b8" fillOpacity="0.45" />
      <text x="156" y="80" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="sans-serif">Create Your Account</text>

      {/* Avatar circle */}
      <circle cx="210" cy="135" r="26" fill="#ecfeff" stroke="#06b6d4" strokeWidth="2.5" />
      <circle cx="210" cy="128" r="10" fill="#0891b2" />
      <path d="M188 155c0-12.1 9.8-22 22-22s22 9.9 22 22" fill="#cffafe" />

      {/* Form lines */}
      <rect x="100" y="175" width="220" height="10" rx="5" fill="#f1f5f9" />
      <rect x="100" y="175" width="140" height="10" rx="5" fill="#06b6d4" />
      <rect x="100" y="195" width="220" height="10" rx="5" fill="#f1f5f9" />
      <rect x="100" y="195" width="90" height="10" rx="5" fill="#94a3b8" />
      <rect x="100" y="215" width="220" height="20" rx="10" fill="#0a192f" />
      <text x="175" y="229" fill="#22d3ee" fontSize="11" fontWeight="700" fontFamily="sans-serif">Join Smart Fix</text>

      {/* Floating badge bottom-left */}
      <g className="register-float-slow">
        <rect x="34" y="200" width="70" height="70" rx="18" fill="#06b6d4" />
        <circle cx="69" cy="231" r="10" fill="#061021" />
        <path d="M64 231l3.5 3.5 7-7" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating badge top-right */}
      <g className="register-float-delayed">
        <rect x="316" y="34" width="70" height="70" rx="18" fill="#112240" stroke="#22d3ee" strokeWidth="2" />
        <path d="M351 48l12 5v9c0 8-5.5 14.5-12 17-6.5-2.5-12-9-12-17v-9l12-5z" stroke="#22d3ee" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M345 68l3.5 3.5 7.5-7.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

// Small inline icon component for form input icons
function FieldIcon({ children }) {
  return (
    <svg
      className="register-input-icon"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function ErrorText({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="register-error-text" role="alert">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </p>
  )
}

function Register() {
  const navigate = useNavigate()

  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    document.title = 'Register – Smart Fix'
  }, [])

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const PHONE_RE = /^\+?[0-9]{10,15}$/

  function validate() {
    const e = {}
    if (!fields.name.trim()) e.name = 'Full name is required.'
    else if (fields.name.trim().length < 2) e.name = 'Name must be at least 2 characters.'

    if (!fields.email.trim()) e.email = 'Email address is required.'
    else if (!EMAIL_RE.test(fields.email.trim())) e.email = 'Please enter a valid email address.'

    if (fields.phone.trim() && !PHONE_RE.test(fields.phone.trim())) {
      e.phone = 'Enter a valid phone number (10–15 digits).'
    }

    if (!fields.password) e.password = 'Password is required.'
    else if (fields.password.length < 6) e.password = 'Password must be at least 6 characters.'

    if (!fields.confirmPassword) e.confirmPassword = 'Please confirm your password.'
    else if (fields.password !== fields.confirmPassword) e.confirmPassword = 'Passwords do not match.'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (statusMessage) setStatusMessage(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatusMessage(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const data = await registerUser({
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        password: fields.password,
        confirmPassword: fields.confirmPassword,
      })

      saveAuthData(data.token, data.user, false)

      setStatusMessage({
        type: 'success',
        text: `Welcome, ${data.user?.name}! Your account has been created. Redirecting to dashboard…`,
      })

      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error.message || 'Registration failed. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      {/* ——— Left: Branding Panel ——— */}
      <aside className="register-brand-panel" aria-label="Smart Fix overview">
        <div className="register-brand-header">
          <Link to="/" className="register-brand-logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <rect width="36" height="36" rx="10" fill="#06b6d4" />
              <path
                d="M22.5 11.5a4.5 4.5 0 0 0-5.8 5.8l-5.9 5.9a1.5 1.5 0 0 0 2.1 2.1l5.9-5.9a4.5 4.5 0 0 0 5.8-5.8l-2.3 2.3-2.1-2.1 2.3-2.3z"
                fill="#061021"
              />
            </svg>
            <span>Smart <span className="register-brand-accent">Fix</span></span>
          </Link>

          <span className="register-brand-badge">
            <span className="register-brand-badge-dot" aria-hidden="true" />
            New Account
          </span>
        </div>

        <div className="register-brand-content">
          <div className="register-illustration-wrapper">
            <RegisterIllustration />
          </div>
          <h2 className="register-brand-title">
            Join Smart Fix.<br /><span>Be the Change.</span>
          </h2>
          <p className="register-brand-tagline">
            Create your free account and start reporting electrical, plumbing, road, and sanitation issues in your
            community. Track every repair from start to resolution.
          </p>
        </div>

        <div className="register-brand-highlights">
          {[
            'Free Citizen Account',
            'Real-Time Tracking',
            'Secure & Private',
          ].map((text) => (
            <div key={text} className="register-highlight-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ——— Right: Register Form ——— */}
      <main className="register-form-panel">
        <div className="register-form-container">
          <Link to="/" className="register-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          <section className="register-card" aria-labelledby="register-heading">
            <div className="register-card-header">
              <h1 id="register-heading" className="register-heading">Create Account</h1>
              <p className="register-subheading">
                Fill in the details below to join Smart Fix and start reporting issues.
              </p>
            </div>

            {statusMessage && (
              <div
                className={`register-status-banner ${statusMessage.type === 'success' ? 'register-status-success' : 'register-status-error'}`}
                role={statusMessage.type === 'error' ? 'alert' : 'status'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {statusMessage.type === 'success' ? (
                    <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                  ) : (
                    <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>
                  )}
                </svg>
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit} noValidate>
              {/* Row 1: Name + Email */}
              <div className="register-form-row">
                {/* Full Name */}
                <div className="register-field">
                  <label htmlFor="reg-name" className="register-label">Full Name</label>
                  <div className={`register-input-wrapper ${errors.name ? 'has-error' : ''}`}>
                    <FieldIcon>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </FieldIcon>
                    <input
                      id="reg-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Arun Kumar"
                      value={fields.name}
                      onChange={handleChange}
                      className={`register-input ${errors.name ? 'has-error' : ''}`}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'reg-name-err' : undefined}
                    />
                  </div>
                  <ErrorText id="reg-name-err" message={errors.name} />
                </div>

                {/* Email */}
                <div className="register-field">
                  <label htmlFor="reg-email" className="register-label">Email Address</label>
                  <div className={`register-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                    <FieldIcon>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </FieldIcon>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={fields.email}
                      onChange={handleChange}
                      className={`register-input ${errors.email ? 'has-error' : ''}`}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'reg-email-err' : undefined}
                    />
                  </div>
                  <ErrorText id="reg-email-err" message={errors.email} />
                </div>
              </div>

              {/* Phone Number */}
              <div className="register-field">
                <label htmlFor="reg-phone" className="register-label">
                  Phone Number <span className="register-label-optional">(optional)</span>
                </label>
                <div className={`register-input-wrapper ${errors.phone ? 'has-error' : ''}`}>
                  <FieldIcon>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 10 19.79 19.79 0 0 1 1.07 1.4A2 2 0 0 1 3.07 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                  </FieldIcon>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={fields.phone}
                    onChange={handleChange}
                    className={`register-input ${errors.phone ? 'has-error' : ''}`}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'reg-phone-err' : undefined}
                  />
                </div>
                <ErrorText id="reg-phone-err" message={errors.phone} />
              </div>

              {/* Row 2: Password + Confirm Password */}
              <div className="register-form-row">
                {/* Password */}
                <div className="register-field">
                  <label htmlFor="reg-password" className="register-label">Password</label>
                  <div className={`register-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                    <FieldIcon>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </FieldIcon>
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      value={fields.password}
                      onChange={handleChange}
                      className={`register-input ${errors.password ? 'has-error' : ''}`}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'reg-pw-err' : undefined}
                    />
                    <button
                      type="button"
                      className="register-toggle-password"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorText id="reg-pw-err" message={errors.password} />
                </div>

                {/* Confirm Password */}
                <div className="register-field">
                  <label htmlFor="reg-confirm" className="register-label">Confirm Password</label>
                  <div className={`register-input-wrapper ${errors.confirmPassword ? 'has-error' : ''}`}>
                    <FieldIcon>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </FieldIcon>
                    <input
                      id="reg-confirm"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={fields.confirmPassword}
                      onChange={handleChange}
                      className={`register-input ${errors.confirmPassword ? 'has-error' : ''}`}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'reg-conf-err' : undefined}
                    />
                    <button
                      type="button"
                      className="register-toggle-password"
                      onClick={() => setShowConfirm((p) => !p)}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      aria-pressed={showConfirm}
                    >
                      {showConfirm ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <ErrorText id="reg-conf-err" message={errors.confirmPassword} />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="register-submit-btn" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Creating Account…' : 'Create Account'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            <div className="register-card-footer">
              <span>Already have an account?</span>
              <Link to="/login" className="register-login-link">Sign In</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Register
