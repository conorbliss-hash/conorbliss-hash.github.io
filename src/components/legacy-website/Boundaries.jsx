import siteData from '../content/site.json'
import './Boundaries.css'

export default function Boundaries() {
  const { boundaries } = siteData

  return (
    <section className="boundaries section">
      <div className="container">
        <h2 className="boundaries-title">{boundaries.title}</h2>
        <ul className="boundaries-list">
          {boundaries.items.map((item, index) => (
            <li key={index} className="boundary-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
