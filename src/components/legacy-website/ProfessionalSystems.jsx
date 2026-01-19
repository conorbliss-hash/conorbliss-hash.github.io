import { useState } from 'react'
import { Link } from 'react-router-dom'
import projectsData from '../content/projects.json'
import './ProfessionalSystems.css'

export default function ProfessionalSystems() {
  const { professional, professionalFraming } = projectsData
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id, e) => {
    e.preventDefault()
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="professional-systems section">
      <div className="container">
        {professionalFraming && (
          <p className="professional-framing">{professionalFraming}</p>
        )}
        <div className="systems-grid">
          {professional.map((system) => {
            const isExpanded = expandedId === system.id
            return (
              <div key={system.id} className={`system-card card ${isExpanded ? 'expanded' : ''}`}>
                <button 
                  className="system-card-header"
                  onClick={(e) => toggleExpand(system.id, e)}
                  aria-expanded={isExpanded}
                >
                  <div className="system-card-summary">
                    <h3 className="system-title">{system.title}</h3>
                    {system.scope && <div className="system-scope">{system.scope}</div>}
                    {system.domainTags && system.domainTags.length > 0 && (
                      <div className="domain-tags">
                        {system.domainTags.map((tag, index) => (
                          <span key={index} className="domain-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <p className="system-outcome-preview">{system.outcome}</p>
                  </div>
                  <span className="system-toggle">{isExpanded ? '−' : '+'}</span>
                </button>
                <div className="system-card-details">
                  {system.riskPrevented && (
                    <div className="system-section risk-section">
                      <h4>Risk Prevented</h4>
                      <p>{system.riskPrevented}</p>
                      {system.mechanismMicro && (
                        <div className="mechanism-micro">Mechanism: {system.mechanismMicro}</div>
                      )}
                    </div>
                  )}
                  {system.mechanism && (
                    <div className="system-section mechanism-section">
                      <h4>Mechanism</h4>
                      <p>{system.mechanism}</p>
                    </div>
                  )}
                  <div className="system-section">
                    <h4>Problem</h4>
                    <p>{system.problem}</p>
                  </div>
                  <div className="system-section">
                    <h4>Approach</h4>
                    <p>{system.approach}</p>
                  </div>
                  <div className="system-section">
                    <h4>Outcome</h4>
                    <p>{system.outcome}</p>
                  </div>
                  <Link to={`/projects/${system.id}`} className="system-link">View System Design</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
