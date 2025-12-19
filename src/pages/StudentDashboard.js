import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import { api } from '../api'
import './StudentDashboard.css'
import '../styles/status.css'

export default function StudentDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [form, setForm] = useState({
    description: '',
    category: 'plumbing',
    image: ''
  })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    if (!user) return
    setLoading(true)
    try {
      const data = await api(`/api/complaints/student/${user.id}`)
      setComplaints(Array.isArray(data) ? data : [])
    } catch {
      setComplaints([])
    }
    setLoading(false)
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function createComplaint(e) {
    e.preventDefault()
    setError('')

    if (!form.description.trim()) {
      return setError('Description is required')
    }

    try {
      const data = await api('/api/complaints', {
        method: 'POST',
        body: JSON.stringify({
          student_id: user.id,
          description: form.description,
          category: form.category,
          image: form.image
        })
      })

      setComplaints(prev => [data, ...prev])
      setForm({ description: '', category: 'plumbing', image: '' })
    } catch {
      setError('Failed to submit complaint')
    }
  }

  function startEdit(c) {
    setEditing(c)
    setForm({
      description: c.description,
      category: c.category,
      image: c.image || ''
    })
    window.scrollTo({ top: 0 })
  }

  async function updateComplaint(e) {
    e.preventDefault()
    try {
      const data = await api(`/api/complaints/${editing.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          description: form.description,
          category: form.category,
          image: form.image
        })
      })

      setComplaints(prev =>
        prev.map(x => (x.id === data.id ? data : x))
      )
      setEditing(null)
      setForm({ description: '', category: 'plumbing', image: '' })
    } catch {
      setError('Failed to update complaint')
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm('Delete this complaint?')) return
    try {
      await api(`/api/complaints/${id}`, { method: 'DELETE' })
      setComplaints(prev => prev.filter(c => c.id !== id))
    } catch {
      setError('Failed to delete complaint')
    }
  }

  function cancelEdit() {
    setEditing(null)
    setForm({ description: '', category: 'plumbing', image: '' })
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-grid">
        <div className="card">
          <h3>{editing ? 'Edit Complaint' : 'Create New Complaint'}</h3>

          <form onSubmit={editing ? updateComplaint : createComplaint}>
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="input"
            >
              <option value="plumbing">Plumbing</option>
              <option value="electricity">Electricity</option>
              <option value="carpentry">Carpentry</option>
              <option value="other">Other</option>
            </select>

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="input"
              required
            />

            <label>Upload Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {form.image && (
              <img src={form.image} alt="preview" width="200" />
            )}

            <button className="btn" type="submit">
              {editing ? 'Update' : 'Submit'}
            </button>

            {editing && (
              <button type="button" className="btn danger" onClick={cancelEdit}>
                Cancel
              </button>
            )}

            {error && <div className="error">{error}</div>}
          </form>
        </div>

        <div className="card">
          <h3>My Complaints</h3>
          <button className="btn" onClick={loadComplaints}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          {complaints.map(c => (
            <div key={c.id} className="complaint-item">
              <h4>{c.category}</h4>
              <p>{c.description}</p>
              <span className={`status-badge status-${c.status}`}>
                {c.status}
              </span>

              {c.status === 'pending' && (
                <>
                  <button className="btn" onClick={() => startEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteComplaint(c.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
