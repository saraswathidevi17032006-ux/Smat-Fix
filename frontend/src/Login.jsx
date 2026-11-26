import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from './api/apiClient.js'
import './Login.css'

// Maintenance-themed SVG illustration for the left branding panel
function MaintenanceIllustration() {
  return (
    <svg
      className="login-illustration"
      viewBox="0 0 420 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of Smart Fix maintenance inspection, tools, and live repair tracking"
    >
      {/* Background Rings */}
      <circle cx="210" cy="160" r="132" fill="#0f294a" stroke="#22d3ee" strokeOpacity="0.22" strokeWidth="2" />
      <circle
        cx="210"
        cy="160"
        r="100"
        fill="#112240"
        stroke="#22d3ee"
        strokeOpacity="0.16"
        strokeDasharray="6 6"
        strokeWidth="1.5"
      />

      {/* Central Maintenance Portal Card */}
      <rect x="78" y="56" width="264" height="200" rx="18" fill="#ffffff" />
      <rect x="78" y="56" width="264" height="40" rx="18" fill="#0a192f" />
      <rect x="78" y="80" width="264" height="16" fill="#0a192f" />

      {/* Card Window Dots & Title */}
      <circle cx="102" cy="76" r="4.5" fill="#22d3ee" />
      <circle cx="118" cy="76" r="4.5" fill="#38bdf8" fillOpacity="0.55" />
      <circle cx="134" cy="76" r="4.5" fill="#94a3b8" fillOpacity="0.45" />
      <text x="155" y="80" fill="#e2e8f0" fontSize="11" fontWeight="700" fontFamily="sans-serif">
        Smart Fix Dispatch
      </text>

      {/* Ticket Row 1 - Electrical */}
      <rect x="98" y="114" width="224" height="44" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="122" cy="136" r="12" fill="#ecfeff" />
      <path d="M123 129l-5 8h4l-1 6 5-8h-4l1-6z" fill="#0891b2" />
      <rect x="144" y="127" width="96" height="7" rx="3.5" fill="#0a192f" />
      <rect x="144" y="140" width="66" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="255" y="127" width="54" height="18" rx="9" fill="#cffafe" />
      <text x="266" y="139" fill="#0891b2" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
        Fixed
      </text>

      {/* Ticket Row 2 - Plumbing */}
      <rect x="98" y="168" width="224" height="44" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <circle cx="122" cy="190" r="12" fill="#e0f2fe" />
      <path d="M122 182c3.5 4.2 5.2 7 5.2 9.4a5.2 5.2 0 1 1-10.4 0c0-2.4 1.7-5.2 5.2-9.4z" fill="#0284c7" />
      <rect x="144" y="181" width="104" height="7" rx="3.5" fill="#0a192f" />
      <rect x="144" y="194" width="72" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="255" y="181" width="54" height="18" rx="9" fill="#0a192f" />
      <text x="265" y="193" fill="#22d3ee" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
        Active
      </text>

      {/* Status Bar */}
      <rect x="98" y="224" width="224" height="16" rx="8" fill="#f1f5f9" />
      <rect x="104" y="228" width="144" height="8" rx="4" fill="#06b6d4" />

      {/* Floating Wrench Tool Badge (Bottom Left) */}
      <g className="login-float-slow">
        <rect x="34" y="198" width="74" height="74" rx="18" fill="#06b6d4" />
        <path
          d="M82 222a9.5 9.5 0 0 0-12 12l-11 11a3 3 0 0 0 4.2 4.2l11-11a9.5 9.5 0 0 0 12-12l-4.8 4.8-4.2-4.2 4.8-4.8z"
          fill="#061021"
        />
      </g>

      {/* Floating Verified Shield Badge (Top Right) */}
      <g className="login-float-delayed">
        <rect x="312" y="34" width="74" height="74" rx="18" fill="#112240" stroke="#22d3ee" strokeWidth="2" />
        <path
          d="M349 52l14 6v10c0 9-6 16.5-14 19-8-2.5-14-10-14-19V58l14-6z"
          stroke="#22d3ee"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M343 70l4 4 8.5-8.5"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

function Login() {
  // Form input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation errors, loading, and feedback message state
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [statusMessage, setStatusMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Login – Smart Fix'
  }, [])

  // Validate email and password fields
  const validateForm = () => {
    const newErrors = { email: '', password: '' }
    const trimmedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedEmail) {
      newErrors.email = 'Email address is required.'
    } else if (!emailPattern.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  // Handle Login button submission against the backend API
  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatusMessage(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const data = await loginUser({
        email: email.trim(),
        password,
      })

      // Store JWT token according to Remember Me preference
      const storage = rememberMe ? localStorage : sessionStorage
      if (data.token) {
        storage.setItem('smartfix_token', data.token)
      }
      if (data.user) {
        storage.setItem('smartfix_user', JSON.stringify(data.user))
      }

      setStatusMessage({
        type: 'success',
        text: `Welcome back, ${data.user?.name || email.trim()}! Login successful.`,
      })
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error.message || 'Login failed. Please check your credentials and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clear field error when user starts typing
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }))
    }
    if (statusMessage) {
      setStatusMessage(null)
    }
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }))
    }
    if (statusMessage) {
      setStatusMessage(null)
    }
  }

  const handleInfoLinkClick = (event, message) => {
    event.preventDefault()
    setStatusMessage({
      type: 'info',
      text: message,
    })
  }

  return (
    <div className="login-page">
      {/* Left Side: Smart Fix Branding, Illustration & Tagline */}
      <aside className="login-brand-panel" aria-label="Smart Fix overview">
        <div className="login-brand-header">
          <Link to="/" className="login-brand-logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <rect width="36" height="36" rx="10" fill="#06b6d4" />
              <path
                d="M22.5 11.5a4.5 4.5 0 0 0-5.8 5.8l-5.9 5.9a1.5 1.5 0 0 0 2.1 2.1l5.9-5.9a4.5 4.5 0 0 0 5.8-5.8l-2.3 2.3-2.1-2.1 2.3-2.3z"
                fill="#061021"
              />
            </svg>
            <span>
              Smart <span className="login-brand-accent">Fix</span>
            </span>
          </Link>

          <span className="login-brand-badge">
            <span className="login-brand-badge-dot" aria-hidden="true" />
            Maintenance Portal
          </span>
        </div>

        <div className="login-brand-content">
          <div className="login-illustration-wrapper">
            <MaintenanceIllustration />
          </div>

          <h2 className="login-brand-title">
            Report Issues. <span>Track Every Fix.</span>
          </h2>
          <p className="login-brand-tagline">
            Your centralized hub for reporting electrical, plumbing, road, and sanitation issues and following repairs
            from submission to verified resolution.
          </p>
        </div>

        <div className="login-brand-highlights">
          <div className="login-highlight-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Fast Issue Reporting</span>
          </div>
          <div className="login-highlight-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Live Status Updates</span>
          </div>
          <div className="login-highlight-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified Technicians</span>
          </div>
        </div>
      </aside>

      {/* Right Side: Clean Modern Login Form */}
      <main className="login-form-panel">
        <div className="login-form-container">
          <Link to="/" className="login-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          <section className="login-card" aria-labelledby="login-heading">
            <div className="login-card-header">
              <h1 id="login-heading" className="login-heading">
                Welcome Back
              </h1>
              <p className="login-subheading">
                Sign in to your Smart Fix account to report and manage maintenance tickets.
              </p>
            </div>

            {statusMessage && (
              <div
                className={`login-status-banner ${
                  statusMessage.type === 'success'
                    ? 'login-status-success'
                    : statusMessage.type === 'error'
                      ? 'login-status-error'
                      : 'login-status-info'
                }`}
                role={statusMessage.type === 'error' ? 'alert' : 'status'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {statusMessage.type === 'success' ? (
                    <>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </>
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </>
                  )}
                </svg>
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Email Input */}
              <div className="login-field">
                <label htmlFor="login-email" className="login-label">
                  Email Address
                </label>
                <div className={`login-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <svg
                    className="login-input-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`login-input ${errors.email ? 'has-error' : ''}`}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'login-email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" className="login-error-text" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="login-field">
                <label htmlFor="login-password" className="login-label">
                  Password
                </label>
                <div className={`login-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <svg
                    className="login-input-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`login-input ${errors.password ? 'has-error' : ''}`}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                  />
                  <button
                    type="button"
                    className="login-toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" className="login-error-text" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="login-options-row">
                <label className="login-remember-label">
                  <input
                    type="checkbox"
                    className="login-checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>

                <a
                  href="#forgot-password"
                  className="login-forgot-link"
                  onClick={(event) =>
                    handleInfoLinkClick(
                      event,
                      'Password recovery will be available once backend authentication is connected.'
                    )
                  }
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Submit Button */}
              <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
                <span>{isSubmitting ? 'Signing in...' : 'Login'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            {/* Register Now Link */}
            <div className="login-card-footer">
              <span>New to Smart Fix?</span>
              <a
                href="#register"
                className="login-register-link"
                onClick={(event) =>
                  handleInfoLinkClick(
                    event,
                    'The Register page will be added in the next step of the Smart Fix project.'
                  )
                }
              >
                Register Now
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Login
