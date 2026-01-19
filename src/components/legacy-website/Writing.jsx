import './Writing.css'

const posts = [
  {
    title: "How I code with agents, without being 'technical'",
    subtitle: "A 5 step process for consistent results",
    url: "https://medium.com/@conor.bliss.henaghan",
    image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*VAaTfTq6jh42fh02SZzfPQ.png"
  },
  {
    title: "An Operating System for Data Authority",
    subtitle: "Designing an AI-Enabled Data Ingestion Pipeline",
    url: "https://medium.com/@conor.bliss.henaghan",
    image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*awjs5NGJbG9Vqw1qi2_hdA.png"
  },
  {
    title: "Making Data Authoritative: The Step Most AI Programs Skip",
    subtitle: "As companies push AI from experiments into real workflows",
    url: "https://medium.com/@conor.bliss.henaghan",
    image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*u02frXKSaGdstN0m-R8lSA.png"
  },
  {
    title: "It's not another dashboard. It's a coach in your inbox.",
    subtitle: "From Data Overload to Clarity. One Email. One Decision for the Week.",
    url: "https://medium.com/@conor.bliss.henaghan",
    image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*qnd-Q-R5NgJLHwJf.png"
  }
]

export default function Writing() {
  return (
    <section className="writing section">
      <div className="container">
        <h2 className="writing-title">Writing</h2>
        <div className="writing-track">
          {posts.map((post, index) => (
            <a 
              key={index} 
              href={post.url} 
              className="writing-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="writing-card-image">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="writing-card-content">
                <h3 className="writing-card-title">{post.title}</h3>
                <p className="writing-card-subtitle">{post.subtitle}</p>
                {post.title === "It's not another dashboard. It's a coach in your inbox." ? null : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
