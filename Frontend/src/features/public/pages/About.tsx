import HeroBanner from "./HeroBanner";

const About = () => (
  <div>
    <HeroBanner
      label="About DesignFlow"
      quote="Where inspiration starts, and every project stays visible."
      image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
    />

    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <span className="block text-xs uppercase tracking-[0.28em] text-clay mb-6">
          Our Story
        </span>

        <p className="text-lg leading-relaxed text-charcoal/80">
          DesignFlow brings one interior design studio's entire
          client-to-project workflow into a single, transparent place.
          Instead of coordinating requests, mood boards, quotations, and
          meetings across email, spreadsheets, and phone calls, our clients
          and designers work through one guided process — from a submitted
          project request, through approval and designer assignment, to a
          finished space showcased in our gallery. Every step stays visible,
          every decision stays on record, and every project moves forward
          with a dedicated designer at your side.
        </p>
      </div>
    </section>
  </div>
);

export default About;