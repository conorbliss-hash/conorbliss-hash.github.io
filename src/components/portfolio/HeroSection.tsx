import profileImage from "@/assets/portrait-city.webp";

const chips = [
  "ISO 42001 certified",
  "AIGP Certified",
  "Strategy consulting",
  "ROI-focused delivery",
  "Cross-functional lead",
];

const CredentialPills = () => (
  <div className="flex flex-wrap gap-2">
    {chips.map((chip) => (
      <span
        key={chip}
        className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full"
      >
        {chip}
      </span>
    ))}
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-6 md:pt-28 md:pb-8">
      <div className="grid items-start gap-10 lg:grid-cols-[65fr_35fr] lg:items-center lg:gap-8">
        {/* Left column: text, aligned to the page content margin */}
        <div className="px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-0">
          <div className="max-w-none text-left">
            <div
              className="hero-in"
              style={{ animationDelay: "0.05s" }}
            >
              <p className="text-muted-foreground text-xs font-semibold mb-3 tracking-widest uppercase font-body">
                AI Lead: Strategy, Governance, Data Platforms
              </p>
            </div>

            <h1
              className="hero-in font-display text-[26px] leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
              style={{ animationDelay: "0.15s" }}
            >
              I take AI programmes past the data and compliance hurdles:{" "}
              <span className="text-gradient">into production, and kept there.</span>
            </h1>

            <p
              className="hero-in text-muted-foreground text-base md:text-lg mb-5 md:mb-6 font-body leading-relaxed"
              style={{ animationDelay: "0.2s" }}
            >
              Data foundations that clear legal, and AI governance that passes external audit.
            </p>

            {/* Mobile: pills + portrait side by side */}
            <div
              className="hero-in lg:hidden"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0 pt-1">
                  <CredentialPills />
                </div>
                <div className="w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary/40">
                  <img
                    src={profileImage}
                    alt="Conor Bliss"
                    className="aspect-square w-full object-cover object-[center_15%] brightness-[0.98] saturate-[0.85]"
                  />
                </div>
              </div>
            </div>

            {/* Desktop: pills only */}
            <div
              className="hero-in hidden lg:block mt-6"
              style={{ animationDelay: "0.25s" }}
            >
              <CredentialPills />
            </div>
          </div>
        </div>

        {/* Right column: desktop portrait only */}
        <div
          className="hero-in hidden lg:block order-last px-6 pt-6 md:pt-2 lg:pr-[max(2rem,calc((100vw-80rem)/2+2.5rem))]"
          style={{ animationDelay: "0s" }}
        >
          <div className="mx-auto w-full max-w-[12rem] overflow-hidden rounded-2xl bg-secondary/40 sm:max-w-[14rem] md:max-w-[16rem] lg:mx-0 lg:ml-auto lg:max-w-[18rem]">
            <img
              src={profileImage}
              alt="Conor Bliss"
              className="aspect-[4/5] w-full object-cover object-[center_15%] brightness-[0.98] saturate-[0.85]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
