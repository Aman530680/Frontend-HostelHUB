import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import { api } from '../api'
import './WorkerDashboard.css'
import '../styles/status.css'

export default function WorkerDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAssignedComplaints()
  }, [])

  async function loadAssignedComplaints() {
    if (!user) return
    setLoading(true)
    try {
      const data = await api('/api/complaints/all')
      setComplaints(Array.isArray(data) ? data : [])
    } catch {
      setComplaints([])
    }
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const body = { status }

    if (
      status === 'in-progress' &&
      !complaints.find(c => c.id === id)?.assigned_worker_id
    ) {
      body.assigned_worker_id = user.id
    }

    try {
      const data = await api(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      })

      setComplaints(prev =>
        prev.map(c => (c.id === data.id ? data : c))
      )
    } catch {
      // optional: error handling UI
    }
  }

  const availableComplaints = complaints.filter(
    c => c.status === 'accepted' && !c.assigned_worker_id
  )

  const myInProgressComplaints = complaints.filter(
    c => c.status === 'in-progress' && c.assigned_worker_id === user?.id
  )

  const myCompletedComplaints = complaints.filter(
    c => c.status === 'completed' && c.assigned_worker_id === user?.id
  )

  return (
    <div className="worker-wrap">
      <div className="worker-header card">
        <h2>Worker Dashboard</h2>
        <p>Manage your assigned complaints</p>
        <button className="btn" onClick={loadAssignedComplaints}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="dashboard-grid">
        {/* AVAILABLE WORK */}
        <div className="complaints-section card">
          <h3>Available Work ({availableComplaints.length})</h3>

          {availableComplaints.map(c => (
            <div key={c.id} className="complaint-card">
              <div className="complaint-info">
                <h4>{c.category} Issue</h4>
                <p><strong>Student:</strong> {c.student_name}</p>
                <p><strong>Room:</strong> {c.room_number}</p>
                <p><strong>Description:</strong> {c.description}</p>
                {c.image && (
                  <img src={c.image} alt="" className="complaint-image" />
                )}
                {c.warden_comments && (
                  <p><strong>Warden Notes:</strong> {c.warden_comments}</p>
                )}
              </div>

              <button
                className="btn"
                onClick={() => updateStatus(c.id, 'in-progress')}
              >
                Take This Job
              </button>
            </div>
          ))}

          {availableComplaints.length === 0 && <p>No available work</p>}
        </div>

        {/* IN PROGRESS */}
        <div className="complaints-section card">
          <h3>My Work In Progress ({myInProgressComplaints.length})</h3>

          {myInProgressComplaints.map(c => (
            <div key={c.id} className="complaint-card">
              <h4>{c.category} Issue</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p>{c.description}</p>

              <button
                className="btn success"
                onClick={() => updateStatus(c.id, 'completed')}
              >
                Mark Complete
              </button>
            </div>
          ))}

          {myInProgressComplaints.length === 0 && <p>No work in progress</p>}
        </div>
      </div>

      {/* COMPLETED */}
      <div className="complaints-section card">
        <h3>My Completed Work ({myCompletedComplaints.length})</h3>

        {myCompletedComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <h4>{c.category} Issue</h4>
            <p><strong>Student:</strong> {c.student_name}</p>
            <p><strong>Room:</strong> {c.room_number}</p>
            <span className="status-badge status-completed">Completed</span>
          </div>
        ))}

        {myCompletedComplaints.length === 0 && (
          <p>No completed work yet</p>
        )}
      </div>
    </div>
  )
}
