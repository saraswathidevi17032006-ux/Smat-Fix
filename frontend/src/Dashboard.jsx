import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthData, createReport, getMyReports, loadSavedUser } from './api/apiClient.js'
import './Dashboard.css'

const SERVICES = [
  {
    id: 'electrical',
    name: 'Electrical',
    desc: 'Broken streetlights, exposed wiring, power fluctuations.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    desc: 'Leaking pipes, clogged drains, low water pressure.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
  {
    id: 'road',
    name: 'Road Damage',
    desc: 'Potholes, cracked sidewalks, damaged traffic signs.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19L8 5" /><path d="M16 5l4 14" /><path d="M12 6v2" /><path d="M12 11v2" /><path d="M12 16v2" />
      </svg>
    ),
  },
  {
    id: 'garbage',
    name: 'Garbage',
    desc: 'Overflowing bins, missed collections, illegal dumping.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    ),
  },
  {
    id: 'other',
    name: 'Other Issues',
    desc: 'Park damage, fallen trees, general maintenance hazards.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
]

const STATS = [
  { label: 'Reports Filed', value: '0', iconColor: 'cyan',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'In Progress', value: '0', iconColor: 'navy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: 'Resolved', value: '0', iconColor: 'green',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { label: 'Notifications', value: '0', iconColor: 'orange',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
]

const CATEGORY_LABELS = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  road: 'Road Damage',
  garbage: 'Garbage',
  other: 'Other Issues',
}

function Dashboard() {
  const navigate = useNavigate()
  // Initialize directly from storage to avoid calling setState inside useEffect
  const [user] = useState(() => loadSavedUser())

  // Reports state fetched from MongoDB Atlas
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(true)

  // Report modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [category, setCategory] = useState('electrical')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formFeedback, setFormFeedback] = useState(null)

  useEffect(() => {
    document.title = 'Dashboard – Smart Fix'
    let active = true

    async function fetchReports() {
      try {
        const data = await getMyReports()
        if (active && Array.isArray(data.reports)) {
          setReports(data.reports)
        }
      } catch {
        // Keep empty list if backend is unreachable
      } finally {
        if (active) {
          setLoadingReports(false)
        }
      }
    }

    fetchReports()
    return () => {
      active = false
    }
  }, [])

  function openReportModal(selectedCategory = 'electrical') {
    setCategory(selectedCategory)
    setFormFeedback(null)
    setIsModalOpen(true)
  }

  function closeReportModal() {
    if (isSubmitting) return
    setIsModalOpen(false)
    setFormFeedback(null)
  }

  async function handleReportSubmit(event) {
    event.preventDefault()
    setFormFeedback(null)

    if (!title.trim() || !location.trim() || !description.trim()) {
      setFormFeedback({
        type: 'error',
        text: 'Please fill in issue title, location, and description.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const data = await createReport({
        category,
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        priority,
      })

      if (data.report) {
        setReports((prev) => [data.report, ...prev])
      }

      setTitle('')
      setLocation('')
      setDescription('')
      setPriority('Medium')
      setFormFeedback({
        type: 'success',
        text: data.message || 'Problem report submitted successfully!',
      })

      setTimeout(() => {
        setIsModalOpen(false)
        setFormFeedback(null)
      }, 1000)
    } catch (error) {
      setFormFeedback({
        type: 'error',
        text: error.message || 'Unable to submit your report. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleLogout() {
    clearAuthData()
    navigate('/')
  }

  const totalCount = reports.length
  const inProgressCount = reports.filter((r) => r.status === 'In Progress').length
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length
  const pendingCount = reports.filter((r) => r.status === 'Pending').length

  const dynamicStats = [
    { ...STATS[0], value: String(totalCount) },
    { ...STATS[1], value: String(inProgressCount) },
    { ...STATS[2], value: String(resolvedCount) },
    { ...STATS[3], label: 'Pending', value: String(pendingCount) },
  ]

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <header className="dashboard-navbar">
        <div className="dashboard-navbar-inner">
          <Link to="/" className="dashboard-brand-logo">
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <rect width="36" height="36" rx="10" fill="#0a192f" />
              <path d="M22.5 11.5a4.5 4.5 0 0 0-5.8 5.8l-5.9 5.9a1.5 1.5 0 0 0 2.1 2.1l5.9-5.9a4.5 4.5 0 0 0 5.8-5.8l-2.3 2.3-2.1-2.1 2.3-2.3z" fill="#22d3ee" />
            </svg>
            <span>Smart <span>Fix</span></span>
          </Link>

          <div className="dashboard-nav-right">
            {user && (
              <div className="dashboard-user-chip">
                <div className="dashboard-user-avatar" aria-hidden="true">{initials}</div>
                {user.name}
              </div>
            )}
            <button type="button" className="dashboard-logout-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="dashboard-welcome-banner">
          <div className="dashboard-welcome-text">
            <h1>Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span>! 👋</h1>
            <p>You are logged in as a {user?.role || 'citizen'}. Report a maintenance issue or track your existing reports below.</p>
          </div>
          <div className="dashboard-welcome-actions">
            <button type="button" className="dashboard-btn-primary" onClick={() => openReportModal('electrical')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Report a Problem
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-stats-row">
          {dynamicStats.map((s) => (
            <div key={s.label} className="dashboard-stat-card">
              <div className={`dashboard-stat-icon ${s.iconColor}`}>{s.icon}</div>
              <div>
                <p className="dashboard-stat-label">{s.label}</p>
                <p className="dashboard-stat-value">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <h2 className="dashboard-section-heading">Report a Service Issue</h2>
        <div className="dashboard-services-grid">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="dashboard-service-card"
              onClick={() => openReportModal(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openReportModal(s.id)
                }
              }}
            >
              <div className="dashboard-service-icon">{s.icon}</div>
              <div>
                <p className="dashboard-service-name">{s.name}</p>
                <p className="dashboard-service-desc">{s.desc}</p>
              </div>
              <button
                type="button"
                className="dashboard-service-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  openReportModal(s.id)
                }}
              >
                Report {s.name} <span aria-hidden="true">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Submitted Reports List */}
        <h2 className="dashboard-section-heading">Your Submitted Reports</h2>
        {loadingReports ? (
          <div className="dashboard-empty-reports">Loading your reports...</div>
        ) : reports.length === 0 ? (
          <div className="dashboard-empty-reports">
            <p>You haven&apos;t submitted any problem reports yet.</p>
            <button type="button" className="dashboard-btn-primary" onClick={() => openReportModal('electrical')}>
              Submit Your First Report
            </button>
          </div>
        ) : (
          <div className="dashboard-reports-list">
            {reports.map((report) => (
              <article key={report._id} className="dashboard-report-card">
                <div className="dashboard-report-top">
                  <span className="dashboard-report-category">
                    {CATEGORY_LABELS[report.category] || report.category}
                  </span>
                  <span className={`dashboard-report-status status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="dashboard-report-title">{report.title}</h3>
                <p className="dashboard-report-location">{report.location}</p>
                <p className="dashboard-report-desc">{report.description}</p>
                <div className="dashboard-report-meta">
                  <span>Priority: <strong>{report.priority}</strong></span>
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Profile */}
        {user && (
          <>
            <h2 className="dashboard-section-heading">Your Profile</h2>
            <div className="dashboard-profile-card">
              <div className="dashboard-profile-avatar-lg" aria-hidden="true">{initials}</div>
              <div className="dashboard-profile-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                {user.phone && <p>{user.phone}</p>}
                <span className="dashboard-role-badge">{user.role}</span>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Report a Problem Modal */}
      {isModalOpen && (
        <div
          className="dashboard-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          onClick={closeReportModal}
        >
          <div className="dashboard-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <div>
                <span className="dashboard-modal-badge">Smart Fix Ticket</span>
                <h3 id="report-modal-title">Report a Problem</h3>
              </div>
              <button
                type="button"
                className="dashboard-modal-close"
                aria-label="Close modal"
                onClick={closeReportModal}
              >
                &times;
              </button>
            </div>

            {formFeedback && (
              <div className={`dashboard-form-alert ${formFeedback.type}`} role="alert">
                {formFeedback.text}
              </div>
            )}

            <form className="dashboard-report-form" onSubmit={handleReportSubmit}>
              <div className="dashboard-form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="report-category">Category</label>
                  <select
                    id="report-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isSubmitting}
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="report-priority">Priority</label>
                  <select
                    id="report-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="dashboard-form-group">
                <label htmlFor="report-title">Issue Title</label>
                <input
                  id="report-title"
                  type="text"
                  placeholder="e.g., Broken streetlight near main gate"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="dashboard-form-group">
                <label htmlFor="report-location">Location</label>
                <input
                  id="report-location"
                  type="text"
                  placeholder="e.g., 2nd Cross Street, Ward 4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="dashboard-form-group">
                <label htmlFor="report-description">Description</label>
                <textarea
                  id="report-description"
                  rows="3"
                  placeholder="Describe the issue clearly so the maintenance team can resolve it quickly..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="dashboard-modal-actions">
                <button type="button" className="dashboard-btn-secondary" onClick={closeReportModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="dashboard-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Smart Fix. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Dashboard
