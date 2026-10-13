import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import './RecipeCard.css'

export default function RecipeCard({ recipe, index = 0 }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const handleEnter = () => {
      gsap.to(el, { y: -6, scale: 1.015, duration: 0.35, ease: 'power2.out' })
      gsap.to(el.querySelector('.card-image img'), { scale: 1.06, duration: 0.5, ease: 'power2.out' })
    }
    const handleLeave = () => {
      gsap.to(el, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(el.querySelector('.card-image img'), { scale: 1, duration: 0.5, ease: 'power2.out' })
    }

    el.addEventListener('mouseenter', handleEnter)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mouseenter', handleEnter)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const timeLabel = recipe.cookingTime
    ? recipe.cookingTime < 60
      ? `${recipe.cookingTime}m`
      : `${Math.floor(recipe.cookingTime / 60)}h ${recipe.cookingTime % 60}m`
    : null

  return (
    <Link to={`/recipes/${recipe._id}`} className="recipe-card" ref={cardRef} style={{ '--delay': `${index * 0.07}s` }}>
      <div className="card-image">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} loading="lazy" />
        ) : (
          <div className="card-image-placeholder">
            <span>◈</span>
          </div>
        )}
        <div className="card-overlay" />
        {recipe.likes?.length > 0 && (
          <div className="card-likes">
            <span>♥</span> {recipe.likes.length}
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{recipe.title}</h3>
        {recipe.description && (
          <p className="card-desc">{recipe.description}</p>
        )}
        <div className="card-meta">
          {timeLabel && (
            <span className="card-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              {timeLabel}
            </span>
          )}
          {recipe.servings && (
            <span className="card-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {recipe.servings}
            </span>
          )}
          {recipe.ingredients?.length > 0 && (
            <span className="card-meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 2l1.5 15M21 2l-1.5 15M3 2h18M9 15v6m6-6v6m-9 0h12"/>
              </svg>
              {recipe.ingredients.length} ingredients
            </span>
          )}
        </div>
        {recipe.createdBy?.name && (
          <div className="card-author">
            <div className="author-avatar">{recipe.createdBy.name[0].toUpperCase()}</div>
            <span>{recipe.createdBy.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
