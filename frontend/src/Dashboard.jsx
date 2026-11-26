import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthData, loadSavedUser } from './api/apiClient.js'
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

function Dashboard() {
  const navigate = useNavigate()
  // Initialize directly from storage to avoid calling setState inside useEffect
  const [user] = useState(() => loadSavedUser())

  useEffect(() => {
    document.title = 'Dashboard – Smart Fix'
  }, [])

  function handleLogout() {
    clearAuthData()
    navigate('/')
  }

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
            <button type="button" className="dashboard-btn-primary" onClick={() => alert('Report a Problem feature coming in the next phase!')}>
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
          {STATS.map((s) => (
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
            <div key={s.id} className="dashboard-service-card">
              <div className="dashboard-service-icon">{s.icon}</div>
              <div>
                <p className="dashboard-service-name">{s.name}</p>
                <p className="dashboard-service-desc">{s.desc}</p>
              </div>
              <button
                type="button"
                className="dashboard-service-btn"
                onClick={() => alert(`${s.name} reporting form coming in the next phase!`)}
              >
                Report {s.name} <span aria-hidden="true">→</span>
              </button>
            </div>
          ))}
        </div>

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

      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Smart Fix. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Dashboard
