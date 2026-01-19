import siteData from '../content/site.json'
import './Hero.css'

export default function Hero() {
  const { hero, howIBuild } = siteData

  return (
    <section className="hero">
      <div className="system-halo"></div>
      <div className="container">
        <div className="hero-layout">
          <div className="hero-content">
            <h1 className="hero-headline">{hero.headline}</h1>
            <p className="hero-subheadline">{hero.subheadline}</p>
            {hero.narrativeSpine && (
              <p className="hero-narrative-spine">{hero.narrativeSpine}</p>
            )}
            {hero.operationalTrust && (
              <p className="hero-operational-trust">{hero.operationalTrust}</p>
            )}
            {hero.proof && (
              <p className="hero-proof"><strong>{hero.proof}</strong></p>
            )}
            {howIBuild && howIBuild.length > 0 && (
              <div className="hero-how-i-build">
                <h3 className="how-i-build-title">How I build</h3>
                <div className="how-i-build-list" style={{padding: 0, margin: 0, listStyle: 'none'}}>
                  {howIBuild.join(' → ')}
                </div>
              </div>
            )}
          </div>
          <div className="hero-image-wrapper">
            <img src="./profile.jpg" alt="Conor Bliss" className="hero-image" />
          </div>
        </div>
      </div>
    </section>
  )
}
