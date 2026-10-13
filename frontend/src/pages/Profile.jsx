import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/RecipeCard'
import Loader from '../components/Loader'
import './Profile.css'

export default function Profile() {
  const { user } = useAuth()
  const pageRef = useRef(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/recipes').then(res => {
      const mine = res.data.filter(r =>
        r.createdBy?._id === (user?._id || user?.id) ||
        r.createdBy === (user?._id || user?.id)
      )
      setRecipes(mine)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.profile-card', { opacity: 0, y: 40, duration: 0.7, ease: 'power3.out' })
      gsap.from('.profile-stat', { opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'back.out(1.5)' })
      gsap.from('.profile-recipes-title', { opacity: 0, y: 20, duration: 0.6, delay: 0.4 })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const totalLikes = recipes.reduce((sum, r) => sum + (r.likes?.length || 0), 0)

  return (
    <div className="page profile-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="profile-card glass">
          <div className="profile-avatar-area">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="profile-glow" />
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="profile-role-badge">Admin</span>
            )}
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{recipes.length}</span>
              <span className="stat-key">Recipes</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="stat-value">{totalLikes}</span>
              <span className="stat-key">Total Likes</span>
            </div>
            <div className="profile-stat-divider" />
            <div className="profile-stat">
              <span className="stat-value">{user?.role || 'user'}</span>
              <span className="stat-key">Role</span>
            </div>
          </div>
        </div>

        <div className="profile-recipes-section">
          <div className="profile-recipes-title">
            <h2 className="section-title">My Recipes</h2>
            <Link to="/create" className="btn-primary">
              + New Recipe
            </Link>
          </div>

          {loading ? (
            <Loader full />
          ) : recipes.length > 0 ? (
            <div className="recipe-grid">
              {recipes.map((recipe, i) => (
                <RecipeCard key={recipe._id} recipe={recipe} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <p>You haven't created any recipes yet.</p>
              <Link to="/create" className="btn-primary">Create Your First Recipe</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
