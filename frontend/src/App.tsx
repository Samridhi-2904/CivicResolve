import { useEffect, useState } from 'react'
import './App.css'

type Issue = {
  id: string
  title: string
  category: string
  location: string
  description: string
  status: 'Reported' | 'In Progress' | 'Resolved'
  priority: 'Low' | 'Medium' | 'High'
  date: string
  icon: string
}

const STORAGE_KEY = 'civicresolve-issues'

const initialIssues: Issue[] = [
  {
    id: 'CR-1024',
    title: 'Large pothole on main road',
    category: 'Roads & Infrastructure',
    location: 'Malviya Nagar, Jaipur',
    description: 'Large pothole on main road causing inconvenience to commuters',
    status: 'In Progress',
    priority: 'High',
    date: 'Oct 10, 2026',
    icon: '🛣️',
  },
  {
    id: 'CR-1023',
    title: 'Garbage collection pending',
    category: 'Waste Management',
    location: 'Vaishali Nagar, Jaipur',
    description: "Garbage collection pending from last 3 days",
    status: 'Reported',
    priority: 'Medium',
    date: 'Oct 10, 2026',
    icon: '🗑️',
  },
  {
    id: 'CR-1022',
    title: 'Streetlight not working',
    category: 'Street Lighting',
    location: 'Mansarovar, Jaipur',
    description: "Streetlight not working from last 3 days",
    status: 'Resolved',
    priority: 'Low',
    date: 'Oct 9, 2026',
    icon: '💡',
  },
  {
    id: 'CR-1021',
    title: 'Blocked drainage system',
    category: 'Water & Drainage',
    location: 'Jagatpura, Jaipur',
    description: "Blocked drainage system",
    status: 'In Progress',
    priority: 'High',
    date: 'Oct 8, 2026',
    icon: '💧',
  },
]

const categories = [
  'Roads & Infrastructure',
  'Waste Management',
  'Street Lighting',
  'Water & Drainage',
  'Public Safety',
  'Other',
]

function App() {
  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const savedIssues = localStorage.getItem(STORAGE_KEY)

      if (savedIssues) {
        return JSON.parse(savedIssues) as Issue[]
      }
    } catch {
      console.error('Could not load saved civic reports.')
    }

    return initialIssues
  })

  const [activeFilter, setActiveFilter] = useState('All Issues')
  const [activePage, setActivePage] = useState('Dashboard')
  const [showReportForm, setShowReportForm] = useState(false)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Issue['priority']>('Medium')
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues))
    } catch {
      console.error('Could not save civic reports.')
    }
  }, [issues])
  const reportedCount = issues.filter(
    (issue) => issue.status === 'Reported',
  ).length

  const inProgressCount = issues.filter(
    (issue) => issue.status === 'In Progress',
  ).length

  const resolvedCount = issues.filter(
    (issue) => issue.status === 'Resolved',
  ).length

  const filteredIssues = issues.filter((issue) => {
    const matchesFilter =
      activeFilter === 'All Issues' || issue.status === activeFilter

    const searchText =
      `${issue.title} ${issue.category} ${issue.location} ${issue.id}`.toLowerCase()

    return matchesFilter && searchText.includes(search.toLowerCase())
  })

  function openReportForm() {
    setActivePage('Report an Issue')
    setShowReportForm(true)
    setNotice('')
  }

  function handleNavigation(page: string) {
    setActivePage(page)
    setNotice('')

    if (page === 'Report an Issue') {
      setShowReportForm(true)
    } else {
      setShowReportForm(false)
    }
  }

  function handleReportSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const categoryIcons: Record<string, string> = {
      'Roads & Infrastructure': '🛣️',
      'Waste Management': '🗑️',
      'Street Lighting': '💡',
      'Water & Drainage': '💧',
      'Public Safety': '🛡️',
      Other: '📍',
    }

    const newIssue: Issue = {
      id: `CR-${1025 + issues.length - initialIssues.length}`,
      title,
      category,
      location,
      description,
      status: 'Reported',
      priority,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      icon: categoryIcons[category] || '📍',
    }

    setIssues((currentIssues) => [newIssue, ...currentIssues])
    setTitle('')
    setCategory(categories[0])
    setLocation('')
    setDescription('')
    setPriority('Medium')
    setShowReportForm(false)
    setActivePage('Dashboard')
    setActiveFilter('All Issues')
    setSearch('')
    setNotice(`Your report has been created successfully. Reference: ${newIssue.id}`)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#dashboard"
          onClick={() => handleNavigation('Dashboard')}
        >
          <span className="brand-mark">C</span>
          <span className="brand-name">
            Civic<span>Resolve</span>
            <small>CITIZEN PORTAL</small>
          </span>
        </a>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav" aria-label="Main navigation">
          <button
            className={`nav-item ${activePage === 'Dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('Dashboard')}
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${activePage === 'Report an Issue' ? 'active' : ''}`}
            onClick={openReportForm}
          >
            <span className="nav-icon">＋</span>
            Report an Issue
            <span className="nav-add">+</span>
          </button>

          <button
            className={`nav-item ${activePage === 'My Reports' ? 'active' : ''}`}
            onClick={() => handleNavigation('My Reports')}
          >
            <span className="nav-icon">▤</span>
            My Reports
          </button>

          <button
            className={`nav-item ${activePage === 'Community' ? 'active' : ''}`}
            onClick={() => handleNavigation('Community')}
          >
            <span className="nav-icon">◎</span>
            Community
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✳</div>
            <strong>Making a difference?</strong>
            <p>Every report brings us one step closer to a better city.</p>
            <button onClick={openReportForm}>Report an issue ↗</button>
          </div>

          <div className="profile">
            <div className="avatar">CR</div>
            <div className="profile-text">
              <strong>Citizen Portal</strong>
              <span>Jaipur, Rajasthan</span>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="live-indicator">
              <span />
              Citizen services
            </span>
            <button
              className="topbar-avatar"
              aria-label="Citizen profile"
              title="Citizen Portal"
            >
              CR
            </button>
          </div>
        </header>

        <div className="page-content">
          {showReportForm ? (
            <section className="form-page">
              <button
                className="back-link"
                onClick={() => handleNavigation('Dashboard')}
              >
                ← Back to dashboard
              </button>

              <div className="page-heading">
                <div>
                  <div className="eyebrow">CITIZEN SERVICES</div>
                  <h1>Report a civic issue</h1>
                  <p>
                    Tell us what needs fixing. Your report can help make your
                    neighbourhood better.
                  </p>
                </div>
              </div>

              <form className="report-form" onSubmit={handleReportSubmit}>
                <div className="form-section-title">
                  <span className="section-number">01</span>
                  <div>
                    <h2>Issue details</h2>
                    <p>Give your report a clear, descriptive title.</p>
                  </div>
                </div>

                <label className="field">
                  <span>Issue title <b>*</b></span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Large pothole near the main crossing"
                    maxLength={100}
                    required
                  />
                </label>

                <label className="field">
                  <span>Category <b>*</b></span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    required
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-section-title second-section">
                  <span className="section-number">02</span>
                  <div>
                    <h2>Location & description</h2>
                    <p>Help the municipal team understand where the issue is.</p>
                  </div>
                </div>

                <label className="field">
                  <span>Location <b>*</b></span>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Street, neighbourhood, or landmark"
                    maxLength={200}
                    required
                  />
                </label>

                <label className="field">
                  <span>Description <b>*</b></span>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the issue and how it affects the community..."
                    rows={5}
                    maxLength={2000}
                    required
                  />
                </label>

                <label className="field">
                  <span>Priority</span>
                  <select
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as Issue['priority'])
                    }
                  >
                    <option value="Low">Low — Minor inconvenience</option>
                    <option value="Medium">Medium — Needs attention</option>
                    <option value="High">High — Urgent issue</option>
                  </select>
                </label>

                <div className="form-actions">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => handleNavigation('Dashboard')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button-primary">
                    Submit report <span>→</span>
                  </button>
                </div>

                <p className="form-note">
                  This demo stores reports in the current browser session only.
                  Backend integration will be added later.
                </p>
              </form>
            </section>
          ) : activePage === 'Community' ? (
            <section className="empty-page">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">YOUR NEIGHBOURHOOD</div>
                  <h1>Community</h1>
                  <p>
                    Civic improvements start when neighbours work together.
                  </p>
                </div>
              </div>
              <div className="community-card">
                <span className="community-icon">◎</span>
                <h2>Stronger communities, better cities.</h2>
                <p>
                  Explore the reports below on your dashboard and help bring
                  visibility to local civic issues.
                </p>
                <button
                  className="button-primary"
                  onClick={() => handleNavigation('Dashboard')}
                >
                  Explore reports →
                </button>
              </div>
            </section>
          ) : (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">
                    SUNDAY, OCTOBER 11, 2026
                  </div>
                  <h1>
                    {activePage === 'My Reports'
                      ? 'My reports'
                      : 'Your city, your voice.'}
                  </h1>
                  <p className="welcome-subtitle">
                    {activePage === 'My Reports'
                      ? 'Keep track of the civic issues you care about.'
                      : 'Together, we can make Jaipur a better place to live.'}
                  </p>
                </div>

                <button className="button-primary report-button" onClick={openReportForm}>
                  <span className="button-plus">＋</span>
                  Report an issue
                </button>
              </div>

              {notice && (
                <div className="notice" role="status">
                  <span>✓</span>
                  {notice}
                  <button
                    onClick={() => setNotice('')}
                    aria-label="Dismiss notification"
                  >
                    ×
                  </button>
                </div>
              )}

              <section className="hero-banner">
                <div className="hero-copy">
                  <span className="hero-kicker">
                    <span className="hero-kicker-dot" />
                    YOUR VOICE MATTERS
                  </span>
                  <h2>Small reports.<br />Big changes.</h2>
                  <p>
                    Spot a problem in your neighbourhood? Report it, follow its
                    progress, and help build a city that works for everyone.
                  </p>
                  <button
                    className="hero-button"
                    onClick={openReportForm}
                  >
                    Report a local issue <span>↗</span>
                  </button>
                </div>

                <div className="hero-art" aria-hidden="true">
                  <div className="sun" />
                  <div className="hero-building building-one">
                    <span /><span /><span /><span />
                  </div>
                  <div className="hero-building building-two">
                    <span /><span /><span /><span /><span /><span />
                  </div>
                  <div className="hero-building building-three">
                    <span /><span /><span /><span />
                  </div>
                  <div className="hero-tree tree-one"><span /></div>
                  <div className="hero-tree tree-two"><span /></div>
                  <div className="hero-road" />
                  <div className="hero-road-line" />
                  <div className="hero-pin">✓</div>
                  <div className="hero-floating-card">
                    <span className="floating-check">✓</span>
                    <span>
                      <strong>Every report counts</strong>
                      <small>Building a better tomorrow</small>
                    </span>
                  </div>
                </div>
              </section>

              <section className="stats-grid" aria-label="Issue statistics">
                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-blue">▤</span>
                    <span className="stat-caption">ALL REPORTS</span>
                  </div>
                  <div className="stat-number">{issues.length}</div>
                  <div className="stat-bottom">
                    <span className="stat-dot dot-blue" />
                    Total civic reports
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-amber">◷</span>
                    <span className="stat-caption">AWAITING ACTION</span>
                  </div>
                  <div className="stat-number">{reportedCount}</div>
                  <div className="stat-bottom">
                    <span className="stat-dot dot-amber" />
                    Newly reported
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-purple">↻</span>
                    <span className="stat-caption">IN PROGRESS</span>
                  </div>
                  <div className="stat-number">{inProgressCount}</div>
                  <div className="stat-bottom">
                    <span className="stat-dot dot-purple" />
                    Being addressed
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon stat-green">✓</span>
                    <span className="stat-caption">COMPLETED</span>
                  </div>
                  <div className="stat-number">{resolvedCount}</div>
                  <div className="stat-bottom">
                    <span className="stat-dot dot-green" />
                    Successfully resolved
                  </div>
                </article>
              </section>

              <section className="issues-section">
                <div className="section-header">
                  <div>
                    <div className="eyebrow">STAY INFORMED</div>
                    <h2>
                      {activePage === 'My Reports'
                        ? 'Your issue tracker'
                        : 'Recent civic reports'}
                    </h2>
                    <p>Transparency is the first step towards change.</p>
                  </div>
                  <span className="issue-count">
                    {filteredIssues.length} reports
                  </span>
                </div>

                <div className="issue-toolbar">
                  <div className="filter-tabs" aria-label="Filter issues">
                    {['All Issues', 'Reported', 'In Progress', 'Resolved'].map(
                      (filter) => (
                        <button
                          key={filter}
                          className={`filter-tab ${activeFilter === filter ? 'selected' : ''}`}
                          onClick={() => setActiveFilter(filter)}
                        >
                          {filter}
                          {filter === 'All Issues' && (
                            <span className="filter-count">{issues.length}</span>
                          )}
                        </button>
                      ),
                    )}
                  </div>

                  <label className="search-box">
                    <span>⌕</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search reports..."
                      aria-label="Search reports"
                    />
                    <kbd>⌘ K</kbd>
                  </label>
                </div>

                <div className="issue-list">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <article
                        className="issue-row"
                        key={issue.id}
                        title={`${issue.title} — ${issue.location}`}
                      >
                        <div className="issue-category-icon">{issue.icon}</div>

                        <div className="issue-main">
                          <div className="issue-title-row">
                            <h3>{issue.title}</h3>
                            <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                              <span />
                              {issue.status}
                            </span>
                          </div>

                          <div className="issue-meta">
                            <span>{issue.id}</span>
                            <span className="meta-separator">·</span>
                            <span>{issue.category}</span>
                            <span className="meta-separator">·</span>
                            <span>⌖ {issue.location}</span>
                          </div>
                        </div>

                        <div className="issue-end">
                          <span className={`priority priority-${issue.priority.toLowerCase()}`}>
                            {issue.priority} priority
                          </span>
                          <span className="issue-date">{issue.date}</span>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="no-issues">
                      <span>⌕</span>
                      <h3>No reports found</h3>
                      <p>Try another search or select a different status filter.</p>
                      <button
                        className="button-secondary"
                        onClick={() => {
                          setSearch('')
                          setActiveFilter('All Issues')
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>

                <div className="list-footer">
                  <span>
                    Showing {filteredIssues.length} of {issues.length} reports
                  </span>
                  <span className="footer-note">
                    Demo data · Live services coming soon
                  </span>
                </div>
              </section>

              <footer className="page-footer">
                <span>© 2026 CivicResolve</span>
                <span>Built for better neighbourhoods <span className="footer-heart">♥</span></span>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App