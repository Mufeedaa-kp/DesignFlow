interface HeroBannerProps {
  label: string;
  quote: string;
  image?: string;
}

const HeroBanner = ({
  label,
  quote,
  image,
}: HeroBannerProps) => {
  const headingLines = quote.split("\n");

  return (
    <section className="hero-fullscreen relative overflow-hidden">
      {image ? (
        <img
          src={image}
          alt=""
          className="hero-fullscreen-img hero-zoom"
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--color-brown-dark)]" />
      )}

      <div className="hero-fullscreen-overlay" />

      <div className="relative z-10 container-page flex flex-col items-start justify-center pt-[calc(var(--navbar-height)+2rem)] pb-12">
        <div className="max-w-3xl">
          <span className="fade-up section-label mb-6 text-[#f5e7d3]" style={{ animationDelay: "0.1s", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
            {label}
          </span>

          <h1 className="hero-heading mb-6">
            {headingLines.map((line, index) => (
              <span key={index} className="text-reveal-mask">
                <span
                  className="text-reveal-line"
                  style={{ animationDelay: `${0.25 + index * 0.12}s` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;