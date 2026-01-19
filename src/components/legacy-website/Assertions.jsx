import { useState } from 'react'
import siteData from '../content/site.json'
import './Assertions.css'

export default function Assertions() {
  const { assertions, assertionsTitle } = siteData
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="assertions section">
      <div className="container">
        <h2 className="assertions-title">{assertionsTitle}</h2>
        <ul className="assertions-list">
          {assertions.map((assertion) => (
            <li 
              key={assertion.id} 
              className={`assertion-item ${expandedId === assertion.id ? 'expanded' : ''}`}
            >
              <button 
                className="assertion-header"
                onClick={() => toggleExpanded(assertion.id)}
                aria-expanded={expandedId === assertion.id}
              >
                <span className="assertion-claim">{assertion.claim}</span>
                <span className="assertion-toggle">{expandedId === assertion.id ? '−' : '+'}</span>
              </button>
              <div className="assertion-explainer">
                <p>{assertion.explainer}</p>
                   {assertion.mechanism && (
                     <div className="assertion-mechanism">Mechanism: {assertion.mechanism}</div>
                   )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
