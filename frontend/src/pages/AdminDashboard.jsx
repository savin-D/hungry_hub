import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import api from '../api/axios'
import Loader from '../components/Loader'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const pageRef = useRef(null)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data)
      setUsers(usersRes.data)
    }).catch(() => setError('Failed to load admin data')).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.from('.admin-stat-card', {
        opacity: 0, y: 30, scale: 0.95, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)'
      })
      gsap.from('.admin-table', { opacity: 0, y: 30, duration: 0.7, delay: 0.4 })
    }, pageRef)
    return () => ctx.revert()
  }, [loading])

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"? This is irreversible.`)) return
    setDeleting(userId)
    setError('')
    setSuccess('')
    try {
      await api.delete(`/admin/user/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
      setStats(prev => prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : prev)
      setSuccess(`User "${userName}" deleted successfully`)
      gsap.from('.alert-success', { opacity: 0, y: -10, duration: 0.4 })
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className="page"><Loader full /></div>

  return (
    <div className="page admin-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="admin-header">
          <p className="section-eyebrow">Admin</p>
          <h1 className="section-title">Dashboard</h1>
        </div>

        {error && <div className="alert alert-error admin-alert">{error}</div>}
        {success && <div className="alert alert-success admin-alert">{success}</div>}

        {/* Stats */}
        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card glass">
              <div className="stat-card-icon users-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <div className="stat-card-num">{stats.totalUsers}</div>
                <div className="stat-card-label">Total Users</div>
              </div>
            </div>

            <div className="admin-stat-card glass">
              <div className="stat-card-icon recipes-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
                </svg>
              </div>
              <div>
                <div className="stat-card-num">{stats.totalRecipes}</div>
                <div className="stat-card-label">Total Recipes</div>
              </div>
            </div>

            <div className="admin-stat-card glass">
              <div className="stat-card-icon today-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <div>
                <div className="stat-card-num">{stats.recipesToday ?? stats.recipesCreatedToday ?? 0}</div>
                <div className="stat-card-label">Recipes Today</div>
              </div>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="admin-table-section">
          <h2 className="admin-table-title">
            All Users
            <span className="user-count">{users.length}</span>
          </h2>
          <div className="admin-table glass">
            <div className="table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {users.length === 0 ? (
              <div className="table-empty">No users found</div>
            ) : (
              users.map((u) => (
                <div key={u._id} className="table-row">
                  <span className="table-cell">
                    <div className="user-row-avatar">{u.name?.[0]?.toUpperCase()}</div>
                    {u.name}
                  </span>
                  <span className="table-cell muted">{u.email}</span>
                  <span className="table-cell">
                    <span className={`role-chip ${u.role}`}>{u.role}</span>
                  </span>
                  <span className="table-cell muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                  <span className="table-cell">
                    <button
                      className="btn-danger table-delete"
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={deleting === u._id}
                    >
                      {deleting === u._id ? '...' : 'Delete'}
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
