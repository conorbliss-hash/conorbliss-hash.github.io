import siteData from '../content/site.json'
import './Footer.css'

export default function Footer() {
  const { links } = siteData

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={links.medium} target="_blank" rel="noopener noreferrer">
              Medium
            </a>
          </div>
          <p className="footer-disclosure">
            Work examples are redacted and/or recreated with synthetic data to protect client confidentiality.
          </p>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Conor Bliss. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
