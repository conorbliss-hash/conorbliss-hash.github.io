import siteData from '../content/site.json'
import './JudgmentCalls.css'

export default function JudgmentCalls() {
  const { judgmentCalls } = siteData

  return (
    <section className="judgment-calls section">
      <div className="container">
        <p className="judgment-calls-statement">
          <span className="judgment-calls-label">{judgmentCalls.title}:</span>{' '}
          {judgmentCalls.items.join('. ')}
        </p>
      </div>
    </section>
  )
}
