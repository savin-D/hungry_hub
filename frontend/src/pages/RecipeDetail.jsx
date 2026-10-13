import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import './RecipeDetail.css'

export default function RecipeDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/recipes/view/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError('Recipe not found'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!recipe) return
    const ctx = gsap.context(() => {
      gsap.from('.recipe-hero-img', { opacity: 0, scale: 1.05, duration: 1, ease: 'power3.out' })
      gsap.from('.recipe-meta-bar', { opacity: 0, y: 20, duration: 0.6, delay: 0.2 })
      gsap.from('.recipe-body > *', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, delay: 0.3 })
    }, pageRef)
    return () => ctx.revert()
  }, [recipe])

  const userId = user?._id || user?.id
  const isLiked = userId && recipe?.likes?.some(id => id.toString() === userId.toString())

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    setLiking(true)
    try {
      await api.put(`/recipes/${id}/likes`)
      // Backend returns totalLikes not the array, so toggle locally
      setRecipe(prev => {
        const alreadyLiked = prev.likes?.some(id => id.toString() === userId.toString())
        const newLikes = alreadyLiked
          ? prev.likes.filter(id => id.toString() !== userId.toString())
          : [...(prev.likes || []), userId]
        return { ...prev, likes: newLikes }
      })
      gsap.fromTo('.like-btn', { scale: 1.3 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
    } catch {} finally {
      setLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return
    setDeleting(true)
    try {
      await api.delete(`/recipes/${id}`)
      navigate('/recipes')
    } catch {
      setError('Failed to delete recipe')
      setDeleting(false)
    }
  }

  const canEdit = user && recipe && (
    user._id === recipe.createdBy?._id ||
    user.id === recipe.createdBy?._id ||
    user.role === 'admin'
  )

  const timeLabel = recipe?.cookingTime
    ? recipe.cookingTime < 60
      ? `${recipe.cookingTime} min`
      : `${Math.floor(recipe.cookingTime / 60)}h ${recipe.cookingTime % 60}m`
    : null

  if (loading) return <div className="page"><Loader full /></div>
  if (error) return (
    <div className="page recipe-detail-page">
      <div className="container">
        <div className="empty-state" style={{ marginTop: '60px' }}>
          <span className="empty-icon">◈</span>
          <p>{error}</p>
          <Link to="/recipes" className="btn-ghost">Back to Recipes</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page recipe-detail-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="detail-back">
          <Link to="/recipes" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            All Recipes
          </Link>
        </div>

        <div className="detail-header">
          <div className="detail-title-area">
            <h1 className="detail-title">{recipe.title}</h1>
            {recipe.description && <p className="detail-desc">{recipe.description}</p>}
          </div>

          <div className="detail-actions">
            <button
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={liking}
            >
              <span className="like-heart">{isLiked ? '♥' : '♡'}</span>
              <span>{recipe.likes?.length || 0}</span>
            </button>
            {canEdit && (
              <>
                <Link to={`/edit/${id}`} className="btn-ghost">Edit</Link>
                <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>

        {recipe.image && (
          <div className="recipe-hero-img-wrap">
            <img src={recipe.image} alt={recipe.title} className="recipe-hero-img" />
          </div>
        )}

        <div className="recipe-meta-bar glass-sm">
          {timeLabel && (
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <div>
                <span className="meta-label">Cook Time</span>
                <span className="meta-val">{timeLabel}</span>
              </div>
            </div>
          )}
          {recipe.servings && (
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <div>
                <span className="meta-label">Servings</span>
                <span className="meta-val">{recipe.servings}</span>
              </div>
            </div>
          )}
          {recipe.ingredients?.length > 0 && (
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <div>
                <span className="meta-label">Ingredients</span>
                <span className="meta-val">{recipe.ingredients.length}</span>
              </div>
            </div>
          )}
          {recipe.createdBy?.name && (
            <div className="meta-item">
              <div className="author-avatar">{recipe.createdBy.name[0].toUpperCase()}</div>
              <div>
                <span className="meta-label">Chef</span>
                <span className="meta-val">{recipe.createdBy.name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="recipe-body">
          {recipe.ingredients?.length > 0 && (
            <div className="recipe-section glass">
              <h2 className="recipe-section-title">
                <span className="section-num">01</span>
                Ingredients
              </h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="ingredient-item">
                    <span className="ingredient-dot" />
                    <span className="ingredient-name">{ing.name}</span>
                    {ing.quantity && <span className="ingredient-qty">{ing.quantity}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions?.length > 0 && (
            <div className="recipe-section glass">
              <h2 className="recipe-section-title">
                <span className="section-num">02</span>
                Instructions
              </h2>
              <ol className="instructions-list">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="instruction-step">
                    <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                    <p className="step-text">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
