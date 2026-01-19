import siteData from '../content/site.json'
import './About.css'

export default function About() {
  const { about } = siteData

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <span className="about-location">📍 {about.location}</span>
          <p className="about-text">
            {about.experience}. {about.focus}
          </p>
        </div>
      </div>
    </section>
  )
}
