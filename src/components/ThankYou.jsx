import { useNavigate } from 'react-router-dom'
import './ThankYou.css'

export default function ThankYou() {
  const navigate = useNavigate()

  return (
    <div className="thankyou-page">
      <div className="thankyou-card">
        <div className="thankyou-icon-wrap">
          <div className="thankyou-icon-ring">
            <i className="fa-solid fa-check" />
          </div>
          <div className="thankyou-icon-pulse" />
        </div>

        <h1 className="thankyou-title">Message Sent!</h1>
        <p className="thankyou-desc">
          Thank you for reaching out. Your message has been successfully delivered.
        </p>
        <p className="thankyou-note">
          I'll get back to you as soon as possible.
        </p>

        <button className="btn thankyou-btn" onClick={() => navigate('/')}>
          <i className="fa-solid fa-arrow-left" /> Back to Homepage
        </button>
      </div>
    </div>
  )
}
