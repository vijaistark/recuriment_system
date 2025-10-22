import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const api = axios.create({ baseURL: 'http://localhost:4000/api' })

function useAuth() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  })
  function saveAuth(data) {
    localStorage.setItem('auth', JSON.stringify(data))
    setAuth(data)
  }
  function logout() {
    localStorage.removeItem('auth')
    setAuth(null)
  }
  return { auth, saveAuth, logout }
}

function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  )
}

function Login() {
  const { saveAuth, auth } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      saveAuth(res.data)
      const role = res.data.user.role
      if (role === 'admin') nav('/admin')
      else if (role === 'recruiter') nav('/recruiter')
      else nav('/candidate')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  if (auth) return <Navigate to={`/${auth.user.role}`} />
  
  return (
    <div className="login-container">
      <div className="login-card card animate-fade-in">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your recruitment account</p>
        </div>
        
        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <input 
              className="form-input" 
              placeholder="Email address" 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <input 
              className="form-input" 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
      {loading && <LoadingSpinner />}
    </div>
  )
}

function Admin() {
  const { auth, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'recruiter' })
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${auth.token}` } })
      setStats(res.data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  async function createUser(e) {
    e.preventDefault()
    setActionLoading('create')
    try {
      await api.post('/admin/users', form, { headers: { Authorization: `Bearer ${auth.token}` } })
      setForm({ name: '', email: '', password: '', role: 'recruiter' })
      await load()
    } catch (err) {
      console.error('Failed to create user:', err)
    } finally {
      setActionLoading('')
    }
  }

  async function assign() {
    setActionLoading('assign')
    try {
      await api.post('/admin/assign-random', {}, { headers: { Authorization: `Bearer ${auth.token}` } })
      await load()
    } catch (err) {
      console.error('Failed to assign candidates:', err)
    } finally {
      setActionLoading('')
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (!auth || auth.user.role !== 'admin') return <Navigate to="/" />
  
  return (
    <div className="container">
      <div className="main-content">
        <div className="dashboard-header animate-fade-in">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="dashboard-actions">
            <button onClick={load} className="btn btn-secondary" disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Stats'}
            </button>
            <button onClick={assign} className="btn btn-primary" disabled={actionLoading === 'assign'}>
              {actionLoading === 'assign' ? 'Assigning...' : 'Assign Candidates'}
            </button>
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </div>
        </div>

        {stats && (
          <div className="stats-grid animate-fade-in">
            <div className="stat-card">
              <div className="stat-value">{stats.recruiterPresent}</div>
              <div className="stat-label">Recruiters Present</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.recruiterAbsent}</div>
              <div className="stat-label">Recruiters Absent</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.candidatePresent}</div>
              <div className="stat-label">Candidates Present</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.candidateAbsent}</div>
              <div className="stat-label">Candidates Absent</div>
            </div>
          </div>
        )}

        <div className="form-section animate-slide-in">
          <h3 className="form-section-title">Create New User</h3>
          <form onSubmit={createUser}>
            <div className="form-row">
              <div className="form-group">
                <input 
                  className="form-input" 
                  placeholder="Full Name" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  className="form-input" 
                  placeholder="Email Address" 
                  type="email"
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input 
                  className="form-input" 
                  placeholder="Password" 
                  type="password" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <select 
                  className="form-select" 
                  value={form.role} 
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  <option value="recruiter">Recruiter</option>
                  <option value="candidate">Candidate</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-success" 
              disabled={actionLoading === 'create'}
            >
              {actionLoading === 'create' ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Recruiter() {
  const { auth, logout } = useAuth()
  const [isPresent, setIsPresent] = useState(auth?.user?.isPresent || false)
  const [meetingLink, setMeetingLink] = useState(auth?.user?.meetingLink || '')
  const [loading, setLoading] = useState(false)

  async function savePresence() {
    setLoading(true)
    try {
      const res = await api.post('/recruiter/presence', { present: isPresent }, { headers: { Authorization: `Bearer ${auth.token}` } })
      setIsPresent(res.data.isPresent)
    } catch (err) {
      console.error('Failed to save presence:', err)
    } finally {
      setLoading(false)
    }
  }

  async function saveMeeting() {
    setLoading(true)
    try {
      const res = await api.post('/recruiter/meeting-link', { meetingLink }, { headers: { Authorization: `Bearer ${auth.token}` } })
      setMeetingLink(res.data.meetingLink)
    } catch (err) {
      console.error('Failed to save meeting link:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!auth || auth.user.role !== 'recruiter') return <Navigate to="/" />
  
  return (
    <div className="container">
      <div className="main-content">
        <div className="dashboard-header animate-fade-in">
          <h1 className="dashboard-title">Recruiter Dashboard</h1>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>

        <div className="presence-indicator animate-slide-in">
          <div className="presence-toggle">
            <label className="form-checkbox">
              <input 
                type="checkbox" 
                checked={isPresent} 
                onChange={e => setIsPresent(e.target.checked)} 
              />
              <span>Mark as Present</span>
            </label>
          </div>
          <div className="presence-status">
            <div className={`status-dot ${isPresent ? '' : 'offline'}`}></div>
            <span>{isPresent ? 'Online' : 'Offline'}</span>
          </div>
          <button 
            onClick={savePresence} 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Status'}
          </button>
        </div>

        <div className="meeting-section animate-slide-in">
          <h3 className="form-section-title">Meeting Link</h3>
          <div className="meeting-link-input">
            <input 
              className="form-input" 
              placeholder="Enter meeting link (Zoom, Teams, etc.)" 
              value={meetingLink} 
              onChange={e => setMeetingLink(e.target.value)}
            />
            <button 
              onClick={saveMeeting} 
              className="btn btn-success" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Link'}
            </button>
          </div>
          {meetingLink && (
            <div className="meeting-info">
              <p className="text-sm text-secondary">Meeting link saved successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Candidate() {
  const { auth, logout } = useAuth()
  const [isPresent, setIsPresent] = useState(auth?.user?.isPresent || false)
  const [meeting, setMeeting] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')

  async function savePresence() {
    setLoading(true)
    try {
      const res = await api.post('/candidate/presence', { present: isPresent }, { headers: { Authorization: `Bearer ${auth.token}` } })
      setIsPresent(res.data.isPresent)
    } catch (err) {
      console.error('Failed to save presence:', err)
    } finally {
      setLoading(false)
    }
  }

  async function getMeeting() {
    setLoading(true)
    try {
      const res = await api.get('/candidate/meeting', { headers: { Authorization: `Bearer ${auth.token}` } })
      setMeeting(res.data)
    } catch (err) {
      console.error('Failed to get meeting:', err)
    } finally {
      setLoading(false)
    }
  }

  async function uploadResume(e) {
    e.preventDefault()
    if (!resumeFile) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('resume', resumeFile)
      const res = await api.post('/candidate/resume', fd, { headers: { Authorization: `Bearer ${auth.token}` } })
      setUploadSuccess('Resume uploaded successfully!')
      setResumeFile(null)
      // Reset success message after 3 seconds
      setTimeout(() => setUploadSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to upload resume:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!auth || auth.user.role !== 'candidate') return <Navigate to="/" />
  
  return (
    <div className="container">
      <div className="main-content">
        <div className="dashboard-header animate-fade-in">
          <h1 className="dashboard-title">Candidate Dashboard</h1>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>

        <div className="presence-indicator animate-slide-in">
          <div className="presence-toggle">
            <label className="form-checkbox">
              <input 
                type="checkbox" 
                checked={isPresent} 
                onChange={e => setIsPresent(e.target.checked)} 
              />
              <span>Mark as Present</span>
            </label>
          </div>
          <div className="presence-status">
            <div className={`status-dot ${isPresent ? '' : 'offline'}`}></div>
            <span>{isPresent ? 'Online' : 'Offline'}</span>
          </div>
          <button 
            onClick={savePresence} 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Status'}
          </button>
        </div>

        <div className="form-section animate-slide-in">
          <h3 className="form-section-title">Upload Resume</h3>
          <form onSubmit={uploadResume}>
            <div className="file-upload">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={e => setResumeFile(e.target.files?.[0] || null)}
                required
              />
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={loading || !resumeFile}
              >
                {loading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </div>
            {uploadSuccess && <div className="success-message">{uploadSuccess}</div>}
          </form>
        </div>

        <div className="meeting-section animate-slide-in">
          <h3 className="form-section-title">Meeting Information</h3>
          <button 
            onClick={getMeeting} 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Meeting Link'}
          </button>
          
          {meeting?.meetingLink && (
            <div className="meeting-info">
              <a 
                href={meeting.meetingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="meeting-link"
              >
                🎥 Join Meeting
              </a>
              <p className="text-sm text-secondary mt-4">
                <strong>Recruiter:</strong> {meeting.recruiterName}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">Recruitment System</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/candidate" element={<Candidate />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
