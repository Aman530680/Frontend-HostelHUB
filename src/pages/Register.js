import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import './Register.css'

export default function Register() {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ role, ...form })
      })

      setMsg('Registered successfully. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)

    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div className="register-page">
      <h2>Register</h2>
      <div className="card">

        <div className="form-row">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
          >
            <option value="student">Student</option>
            <option value="warden">Warden</option>
            <option value="worker">Worker</option>
          </select>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-row">
            <label>Name</label>
            <input name="name" onChange={onChange} className="input" required />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input name="email" type="email" onChange={onChange} className="input" required />
          </div>

          {role === 'student' && (
            <>
              <div className="form-row">
                <label>Student ID</label>
                <input name="student_id" onChange={onChange} className="input" required />
              </div>

              <div className="form-row">
                <label>Room Number</label>
                <input name="room_number" onChange={onChange} className="input" required />
              </div>

              <div className="form-row">
                <label>Department</label>
                <select name="department" onChange={onChange} className="input">
                  <option value="">Select</option>
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="CCE">CCE</option>
                  <option value="EEE">EEE</option>
                  <option value="IT">IT</option>
                </select>
              </div>

              <div className="form-row">
                <label>Hostel Block</label>
                <select name="hostel_block" onChange={onChange} className="input">
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </>
          )}

          {role === 'warden' && (
            <>
              <div className="form-row">
                <label>Warden ID</label>
                <input name="warden_id" onChange={onChange} className="input" required />
              </div>

              <div className="form-row">
                <label>Hostel Block</label>
                <select name="hostel_block" onChange={onChange} className="input">
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </>
          )}

          {role === 'worker' && (
            <>
              <div className="form-row">
                <label>Worker ID</label>
                <input name="worker_id" onChange={onChange} className="input" required />
              </div>

              <div className="form-row">
                <label>Contact</label>
                <input name="contact" onChange={onChange} className="input" required />
              </div>

              <div className="form-row">
                <label>Category</label>
                <select name="category" onChange={onChange} className="input">
                  <option value="">Select</option>
                  <option value="electricity">Electricity</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="carpentry">Carpentry</option>
                </select>
              </div>
            </>
          )}

          <div className="form-row">
            <label>Password</label>
            <input name="password" type="password" onChange={onChange} className="input" required />
          </div>

          <div className="form-row">
            <button className="btn" type="submit">Register</button>
          </div>
        </form>

        {msg && <div className="small">{msg}</div>}
      </div>
    </div>
  )
}
