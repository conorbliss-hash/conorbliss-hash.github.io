import siteData from '../content/site.json'
import './ProofSignals.css'

export default function ProofSignals() {
  const { proofSignals } = siteData

  return (
    <section className="proof-signals section">
      <div className="container">
        <ul className="signals-list">
          {proofSignals.map((signal, index) => (
            <li key={index} className="signal-item">
              {signal}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
