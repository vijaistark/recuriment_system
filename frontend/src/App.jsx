import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
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

function Login() {
  const { saveAuth, auth } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      saveAuth(res.data)
      const role = res.data.user.role
      if (role === 'admin') nav('/admin')
      else if (role === 'recruiter') nav('/recruiter')
      else nav('/candidate')
    } catch (err) {
      setError('Invalid credentials')
    }
  }
  if (auth) return <Navigate to={`/${auth.user.role}`} />
  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  )
}

function Admin() {
  const { auth, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'recruiter' })
  async function load() {
    const res = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${auth.token}` } })
    setStats(res.data)
  }
  async function createUser(e){
    e.preventDefault()
    await api.post('/admin/users', form, { headers: { Authorization: `Bearer ${auth.token}` } })
    setForm({ name: '', email: '', password: '', role: 'recruiter' })
    await load()
  }
  async function assign(){
    await api.post('/admin/assign-random', {}, { headers: { Authorization: `Bearer ${auth.token}` } })
    await load()
  }
  if (!auth || auth.user.role !== 'admin') return <Navigate to="/" />
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <button onClick={load}>Refresh Stats</button>
        <button onClick={assign} style={{ marginLeft: 8 }}>Assign Candidates Randomly</button>
      </div>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxWidth: 420 }}>
          <div>Recruiters Present: <b>{stats.recruiterPresent}</b></div>
          <div>Recruiters Absent: <b>{stats.recruiterAbsent}</b></div>
          <div>Candidates Present: <b>{stats.candidatePresent}</b></div>
          <div>Candidates Absent: <b>{stats.candidateAbsent}</b></div>
        </div>
      )}
      <h3 style={{ marginTop: 24 }}>Create User</h3>
      <form onSubmit={createUser} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
        <select value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
          <option value="recruiter">Recruiter</option>
          <option value="candidate">Candidate</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

function Recruiter() {
  const { auth, logout } = useAuth()
  const [isPresent, setIsPresent] = useState(auth?.user?.isPresent || false)
  const [meetingLink, setMeetingLink] = useState(auth?.user?.meetingLink || '')
  if (!auth || auth.user.role !== 'recruiter') return <Navigate to="/" />
  async function savePresence(){
    const res = await api.post('/recruiter/presence', { present: isPresent }, { headers: { Authorization: `Bearer ${auth.token}` } })
    setIsPresent(res.data.isPresent)
  }
  async function saveMeeting(){
    const res = await api.post('/recruiter/meeting-link', { meetingLink }, { headers: { Authorization: `Bearer ${auth.token}` } })
    setMeetingLink(res.data.meetingLink)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Recruiter</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" checked={isPresent} onChange={e=>setIsPresent(e.target.checked)} /> Present
        </label>
        <button onClick={savePresence} style={{ marginLeft: 8 }}>Save</button>
      </div>
      <div>
        <input placeholder="Meeting Link" value={meetingLink} onChange={e=>setMeetingLink(e.target.value)} style={{ width: 360 }} />
        <button onClick={saveMeeting} style={{ marginLeft: 8 }}>Save</button>
      </div>
    </div>
  )
}

function Candidate() {
  const { auth, logout } = useAuth()
  const [isPresent, setIsPresent] = useState(auth?.user?.isPresent || false)
  const [meeting, setMeeting] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  if (!auth || auth.user.role !== 'candidate') return <Navigate to="/" />
  async function savePresence(){
    const res = await api.post('/candidate/presence', { present: isPresent }, { headers: { Authorization: `Bearer ${auth.token}` } })
    setIsPresent(res.data.isPresent)
  }
  async function getMeeting(){
    const res = await api.get('/candidate/meeting', { headers: { Authorization: `Bearer ${auth.token}` } })
    setMeeting(res.data)
  }
  async function uploadResume(e){
    e.preventDefault()
    if (!resumeFile) return
    const fd = new FormData()
    fd.append('resume', resumeFile)
    const res = await api.post('/candidate/resume', fd, { headers: { Authorization: `Bearer ${auth.token}` } })
    alert('Uploaded: ' + res.data.resumePath)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Candidate</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" checked={isPresent} onChange={e=>setIsPresent(e.target.checked)} /> Present
        </label>
        <button onClick={savePresence} style={{ marginLeft: 8 }}>Save</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <form onSubmit={uploadResume}>
          <input type="file" onChange={e=>setResumeFile(e.target.files?.[0] || null)} />
          <button type="submit" style={{ marginLeft: 8 }}>Upload Resume</button>
        </form>
      </div>
      <div>
        <button onClick={getMeeting}>Get Meeting Link</button>
        {meeting?.meetingLink && (
          <div style={{ marginTop: 8 }}>
            <a href={meeting.meetingLink} target="_blank">Join Meeting</a>
            <div>Recruiter: {meeting.recruiterName}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Home</Link>
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
