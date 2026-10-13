import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import api from '../api/axios'
import RecipeCard from '../components/RecipeCard'
import Loader from '../components/Loader'
import './Recipes.css'

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchMode, setSearchMode] = useState('title') // 'title' | 'ingredients'
  const [searching, setSearching] = useState(false)
  const pageRef = useRef(null)
  const searchTimeout = useRef(null)

  useEffect(() => {
    api.get('/recipes').then(res => {
      setRecipes(res.data)
      setFiltered(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.recipes-header', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
      gsap.from('.search-bar', { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: 'power3.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    clearTimeout(searchTimeout.current)
    if (!search.trim()) {
      setFiltered(recipes)
      return
    }
    if (searchMode === 'title') {
      const q = search.toLowerCase()
      setFiltered(recipes.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      ))
    } else {
      searchTimeout.current = setTimeout(async () => {
        setSearching(true)
        try {
          const res = await api.get(`/recipes/search?ingredients=${encodeURIComponent(search)}`)
          setFiltered(res.data)
        } catch {
          setFiltered([])
        } finally {
          setSearching(false)
        }
      }, 600)
    }
  }, [search, searchMode, recipes])

  return (
    <div className="page recipes-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="recipes-header">
          <div>
            <p className="section-eyebrow">Community</p>
            <h1 className="section-title">All Recipes</h1>
          </div>
          <p className="section-subtitle">{recipes.length} recipes shared by the community</p>
        </div>

        <div className="search-bar glass-sm">
          <div className="search-modes">
            <button
              className={`mode-btn ${searchMode === 'title' ? 'active' : ''}`}
              onClick={() => { setSearchMode('title'); setSearch('') }}
            >
              By Title
            </button>
            <button
              className={`mode-btn ${searchMode === 'ingredients' ? 'active' : ''}`}
              onClick={() => { setSearchMode('ingredients'); setSearch('') }}
            >
              By Ingredients
            </button>
          </div>
          <div className="search-input-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={searchMode === 'title' ? 'Search recipes...' : 'e.g. chicken, garlic, lemon'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        {loading || searching ? (
          <Loader full />
        ) : filtered.length > 0 ? (
          <div className="recipe-grid">
            {filtered.map((recipe, i) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">◈</span>
            <p>{search ? `No recipes found for "${search}"` : 'No recipes yet'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
