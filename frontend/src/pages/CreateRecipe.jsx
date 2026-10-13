import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import api from '../api/axios'
import './RecipeForm.css'

const emptyIngredient = { name: '', quantity: '' }

export default function CreateRecipe() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    cookingTime: '',
    servings: '',
    ingredients: [{ ...emptyIngredient }],
    instructions: [''],
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.form-card', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
      gsap.from('.form-section', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.2 })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const setIngredient = (i, key, val) => {
    const list = [...form.ingredients]
    list[i] = { ...list[i], [key]: val }
    set('ingredients', list)
  }
  const addIngredient = () => set('ingredients', [...form.ingredients, { ...emptyIngredient }])
  const removeIngredient = (i) => set('ingredients', form.ingredients.filter((_, idx) => idx !== i))

  const setInstruction = (i, val) => {
    const list = [...form.instructions]
    list[i] = val
    set('instructions', list)
  }
  const addInstruction = () => set('instructions', [...form.instructions, ''])
  const removeInstruction = (i) => set('instructions', form.instructions.filter((_, idx) => idx !== i))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validIngredients = form.ingredients.filter(i => i.name.trim())
    const validInstructions = form.instructions.filter(s => s.trim())

    if (!form.title.trim()) { setError('Title is required'); return }
    if (validIngredients.length === 0) { setError('Add at least one ingredient'); return }
    if (validInstructions.length === 0) { setError('Add at least one instruction step'); return }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('title', form.title.trim())
      if (form.description) data.append('description', form.description)
      if (form.cookingTime) data.append('cookingTime', form.cookingTime)
      if (form.servings) data.append('servings', form.servings)
      data.append('ingredients', JSON.stringify(validIngredients))
      data.append('instructions', JSON.stringify(validInstructions))
      if (image) data.append('image', image)

      const res = await api.post('/recipes', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/recipes/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page recipe-form-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="form-page-header">
          <p className="section-eyebrow">Create</p>
          <h1 className="section-title">New Recipe</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-card glass">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Basic info */}
          <div className="form-section">
            <h2 className="form-section-title">Basic Info</h2>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Title *</label>
                <input type="text" className="input-field" placeholder="e.g. Creamy Garlic Pasta" value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea className="input-field textarea" rows={3} placeholder="Briefly describe your recipe..." value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Cook Time (minutes)</label>
                <input type="number" className="input-field" placeholder="30" min="1" value={form.cookingTime} onChange={e => set('cookingTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Servings</label>
                <input type="number" className="input-field" placeholder="4" min="1" value={form.servings} onChange={e => set('servings', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          {/* Image */}
          <div className="form-section">
            <h2 className="form-section-title">Photo</h2>
            <label className="image-upload-area">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                  </svg>
                  <span>Click to upload image</span>
                  <span className="upload-hint">PNG, JPG up to 10MB</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="file-input" />
            </label>
            {imagePreview && (
              <button type="button" className="btn-ghost remove-image" onClick={() => { setImage(null); setImagePreview(null) }}>
                Remove image
              </button>
            )}
          </div>

          <div className="form-divider" />

          {/* Ingredients */}
          <div className="form-section">
            <h2 className="form-section-title">Ingredients</h2>
            <div className="list-editor">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="list-row">
                  <input type="text" className="input-field" placeholder="Ingredient name" value={ing.name} onChange={e => setIngredient(i, 'name', e.target.value)} />
                  <input type="text" className="input-field qty-input" placeholder="Qty (e.g. 2 cups)" value={ing.quantity} onChange={e => setIngredient(i, 'quantity', e.target.value)} />
                  {form.ingredients.length > 1 && (
                    <button type="button" className="row-remove" onClick={() => removeIngredient(i)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-ghost add-row" onClick={addIngredient}>
                + Add Ingredient
              </button>
            </div>
          </div>

          <div className="form-divider" />

          {/* Instructions */}
          <div className="form-section">
            <h2 className="form-section-title">Instructions</h2>
            <div className="list-editor">
              {form.instructions.map((step, i) => (
                <div key={i} className="instruction-row">
                  <span className="step-badge">{String(i + 1).padStart(2, '0')}</span>
                  <textarea
                    className="input-field textarea step-textarea"
                    rows={2}
                    placeholder={`Step ${i + 1}...`}
                    value={step}
                    onChange={e => setInstruction(i, e.target.value)}
                  />
                  {form.instructions.length > 1 && (
                    <button type="button" className="row-remove" onClick={() => removeInstruction(i)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-ghost add-row" onClick={addInstruction}>
                + Add Step
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="loader-spinner loader-sm" />
                  Publishing...
                </span>
              ) : 'Publish Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
