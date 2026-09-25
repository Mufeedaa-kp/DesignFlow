interface HeroBannerProps {
  label: string;
  quote: string;
  image?: string;
}

const HeroBanner = ({
  label,
  quote,
  image,
}: HeroBannerProps) => (
  <section className="relative h-[55vh] min-h-95 overflow-hidden">
    {image ? (
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <div className="absolute inset-0 bg-linear-to-br from-panel via-cream to-surface" />
    )}

    <div className="absolute inset-0 bg-linear-to-t from-charcoal/75 via-charcoal/25 to-charcoal/50" />

    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
      <span className="text-xs uppercase tracking-[0.28em] text-amber mb-5">
        {label}
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream max-w-2xl leading-tight">
        {quote}
      </h1>
    </div>
  </section>
);

export default HeroBanner;