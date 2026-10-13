import { useRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import api from '../api/axios'
import Loader from '../components/Loader'
import './RecipeForm.css'

export default function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [form, setForm] = useState(null)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/recipes/view/${id}`).then(res => {
      const r = res.data
      setForm({
        title: r.title || '',
        description: r.description || '',
        cookingTime: r.cookingTime || '',
        servings: r.servings || '',
        ingredients: r.ingredients?.length ? r.ingredients : [{ name: '', quantity: '' }],
        instructions: r.instructions?.length ? r.instructions : [''],
      })
      if (r.image) setImagePreview(r.image)
    }).catch(() => setError('Failed to load recipe')).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!form) return
    const ctx = gsap.context(() => {
      gsap.from('.form-card', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [form])

  if (loading) return <div className="page"><Loader full /></div>
  if (error || !form) return (
    <div className="page"><div className="container" style={{ paddingTop: 80 }}>
      <div className="alert alert-error">{error || 'Recipe not found'}</div>
    </div></div>
  )

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))
  const setIngredient = (i, key, val) => {
    const list = [...form.ingredients]; list[i] = { ...list[i], [key]: val }; set('ingredients', list)
  }
  const addIngredient = () => set('ingredients', [...form.ingredients, { name: '', quantity: '' }])
  const removeIngredient = (i) => set('ingredients', form.ingredients.filter((_, idx) => idx !== i))
  const setInstruction = (i, val) => {
    const list = [...form.instructions]; list[i] = val; set('instructions', list)
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
    setSaving(true)
    try {
      const data = new FormData()
      data.append('title', form.title.trim())
      if (form.description) data.append('description', form.description)
      if (form.cookingTime) data.append('cookingTime', form.cookingTime)
      if (form.servings) data.append('servings', form.servings)
      data.append('ingredients', JSON.stringify(validIngredients))
      data.append('instructions', JSON.stringify(validInstructions))
      if (image) data.append('image', image)

      await api.put(`/recipes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/recipes/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recipe')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page recipe-form-page" ref={pageRef}>
      <div className="ambient ambient-1" />
      <div className="container">
        <div className="form-page-header">
          <p className="section-eyebrow">Edit</p>
          <h1 className="section-title">Update Recipe</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-card glass">
          {error && <div className="alert alert-error" style={{ margin: '24px 40px 0' }}>{error}</div>}

          <div className="form-section">
            <h2 className="form-section-title">Basic Info</h2>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Title *</label>
                <input type="text" className="input-field" value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea className="input-field textarea" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Cook Time (min)</label>
                <input type="number" className="input-field" min="1" value={form.cookingTime} onChange={e => set('cookingTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Servings</label>
                <input type="number" className="input-field" min="1" value={form.servings} onChange={e => set('servings', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-divider" />

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
                  <span>Click to upload new image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="file-input" />
            </label>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <h2 className="form-section-title">Ingredients</h2>
            <div className="list-editor">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="list-row">
                  <input type="text" className="input-field" placeholder="Ingredient name" value={ing.name} onChange={e => setIngredient(i, 'name', e.target.value)} />
                  <input type="text" className="input-field qty-input" placeholder="Qty" value={ing.quantity} onChange={e => setIngredient(i, 'quantity', e.target.value)} />
                  {form.ingredients.length > 1 && <button type="button" className="row-remove" onClick={() => removeIngredient(i)}>✕</button>}
                </div>
              ))}
              <button type="button" className="btn-ghost add-row" onClick={addIngredient}>+ Add Ingredient</button>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <h2 className="form-section-title">Instructions</h2>
            <div className="list-editor">
              {form.instructions.map((step, i) => (
                <div key={i} className="instruction-row">
                  <span className="step-badge">{String(i + 1).padStart(2, '0')}</span>
                  <textarea className="input-field textarea step-textarea" rows={2} value={step} onChange={e => setInstruction(i, e.target.value)} />
                  {form.instructions.length > 1 && <button type="button" className="row-remove" onClick={() => removeInstruction(i)}>✕</button>}
                </div>
              ))}
              <button type="button" className="btn-ghost add-row" onClick={addInstruction}>+ Add Step</button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate(`/recipes/${id}`)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <span className="btn-loading"><span className="loader-spinner loader-sm" />Saving...</span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
