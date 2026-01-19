import projectsData from '../content/projects.json'
import './MarqueeProject.css'

export default function MarqueeProject() {
  const { marquee } = projectsData

  return (
    <section className="marquee-project section" id="projects">
      <div className="container">
        {marquee.anchorText && (
          <p className="anchor-text">{marquee.anchorText}</p>
        )}
        <div className="marquee-card">
          <div className="marquee-header">
            <div className="marquee-label">{marquee.label}</div>
            <h3 className="marquee-title">{marquee.title}</h3>
            <p className="marquee-tagline">{marquee.tagline}</p>
          </div>
          {marquee.domainTags && marquee.domainTags.length > 0 && (
            <div className="domain-tags">
              {marquee.domainTags.map((tag, index) => (
                <span key={index} className="domain-tag">{tag}</span>
              ))}
            </div>
          )}
          <p className="marquee-description">{marquee.problem}</p>
          <p className="marquee-approach">{marquee.approach}</p>
          {marquee.organizationalBridge && (
            <p className="organizational-bridge">{marquee.organizationalBridge}</p>
          )}
          <div className="marquee-tags">
            {marquee.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <a href={marquee.github} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            View Project
          </a>
        </div>
      </div>
    </section>
  )
}
