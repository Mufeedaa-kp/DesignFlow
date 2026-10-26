import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

import { useAuth } from "../../auth/hooks/useAuth";

const HERO_SLIDES = [
  {
    label: "Modular Kitchen",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=85",
  },
  {
    label: "Living Space",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85",
  },
  {
    label: "Wardrobe Fit-out",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=2000&q=85",
  },
];

const WHAT_WE_DO = [
  {
    num: "01",
    title: "Modular Kitchen",
    text: "Straight, L-shaped, and island layouts tailored to how you actually cook and gather.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    to: "/products/modular-kitchen",
  },
  {
    num: "02",
    title: "Furniture",
    text: "Custom, handcrafted pieces built to fit your space, your style, and your budget.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    to: "/products/furniture",
  },
  {
    num: "03",
    title: "Wardrobe",
    text: "Walk-ins and fitted wardrobes designed around how you actually store and dress.",
    image:
      "https://res.cloudinary.com/zmpym9nr/image/upload/v1793016144/WhatsApp_Image_2026-10-26_at_1.01.14_PM_4.jpg",
    to: "/products/wardrobe",
  },
];

const WHY_US = [
  {
    num: "01",
    title: "Transparent Tracking",
    text: "Every request, quotation, and meeting visible in one dashboard.",
  },
  {
    num: "02",
    title: "Dedicated Designer",
    text: "One assigned designer sees your project through, start to finish.",
  },
  {
    num: "03",
    title: "Considered Quotations",
    text: "Itemized, transparent pricing — no surprises along the way.",
  },
  {
    num: "04",
    title: "Built to Last",
    text: "Durable materials and craftsmanship that hold up over years.",
  },
];

const PROCESS = [
  {
    num: "01",
    title: "We Listen",
    text: "Understanding your space, needs, and vision.",
  },
  {
    num: "02",
    title: "Brainstorm",
    text: "Shaping ideas into a workable design direction.",
  },
  {
    num: "03",
    title: "Review",
    text: "Refining the plan together until it's right.",
  },
  {
    num: "04",
    title: "Design & Install",
    text: "Bringing the finished plan into your space.",
  },
  {
    num: "05",
    title: "Create",
    text: "Handing over a space made to feel like home.",
  },
];

const STATS = [
  {
    value: "100%",
    label: "Customer Satisfaction",
  },
  {
    value: "3+",
    label: "Years of Experience",
  },
  {
    value: "50+",
    label: "Projects Delivered",
  },
  {
    value: "3",
    label: "Roles, One Platform",
  },
];

const PORTFOLIO = [
  {
    tag: "Modular Kitchen",
    title: "The Hollis Residence",
    image:
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Furniture",
    title: "Marlow Living Room",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Wardrobe",
    title: "Aster Walk-in",
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Modular Kitchen",
    title: "The Cedar Loft",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "DesignFlow made it effortless to track every stage of our kitchen renovation — from the first mood board to the final install.",
    name: "Ariel Fernandes",
    role: "Homeowner, Kozhikode",
  },
  {
    quote:
      "Clear quotations, one dedicated designer, and no more chasing updates over WhatsApp. Exactly the process we needed.",
    name: "Priya Menon",
    role: "Homeowner, Calicut",
  },
];

const Landing = () => {

  const { user } = useAuth();


  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex(
        (current) =>
          (current + 1) % HERO_SLIDES.length
      );
    }, 3800);

    return () => clearInterval(id);
  }, []);


  const trackRef =
    useRef<HTMLDivElement>(null);

  const [pfIndex, setPfIndex] = useState(0);

  const scrollPortfolio = (dir: 1 | -1) => {
    setPfIndex((current) => {
      const next = current + dir;

      return Math.min(
        Math.max(next, 0),
        PORTFOLIO.length - 1
      );
    });
  };

  useEffect(() => {
    if (!trackRef.current) return;

    const isMobile =
      window.innerWidth < 768;

    const isTablet =
      window.innerWidth >= 768 &&
      window.innerWidth < 1024;

    const perView = isMobile
      ? 1
      : isTablet
        ? 2
        : 3;

    const maxIndex = Math.max(
      0,
      PORTFOLIO.length - perView
    );

    const safeIndex = Math.min(
      pfIndex,
      maxIndex
    );

    const gap = 24;

    const width =
      trackRef.current.parentElement
        ?.clientWidth ?? 0;

    const cardWidth =
      (width - gap * (perView - 1)) /
      perView;

    trackRef.current.style.transform =
      `translateX(-${
        safeIndex * (cardWidth + gap)
      }px)`;
  }, [pfIndex]);

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative h-[85vh] min-h- 162.5 overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.label}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === heroIndex
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.label}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-charcoal/45" />

            <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/20 to-charcoal/40" />

            <span className="absolute bottom-6 right-8 text-[10px] uppercase tracking-[0.2em] text-cream/50">
              {slide.label} —{" "}
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6 sm:px-10">
          <div>
            <span className="mb-5 block text-xs uppercase tracking-[0.28em] text-amber">
              Interior Design Studio
            </span>

            <h1 className="max-w-2xl font-serif text-5xl leading-[1.04] text-cream sm:text-6xl lg:text-7xl">
              Create your own{" "}
              <em className="italic text-amber">
                comfort
              </em>
              , designed around you
            </h1>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              From first sketch to final install —
              DesignFlow brings your project, your
              designer, and every decision together
              in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to={user ? "/client/requests/new" : "/register"}
                className="bg-amber px-8 py-4 text-xs uppercase tracking-widest text-charcoal transition-colors hover:bg-cream">
  Start a Project
</Link>

              <Link
                to="/products"
                className="border border-cream/40 px-8 py-4 text-xs uppercase tracking-widest text-cream transition-colors hover:border-cream"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2.5">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.label}
              type="button"
              onClick={() => setHeroIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-0.5 w-7 transition-colors ${
                i === heroIndex
                  ? "bg-amber"
                  : "bg-cream/30"
              }`}
            />
          ))}
        </div>
      </section>

      
      <section className="bg-panel/40">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 sm:px-10 md:grid-cols-2">
          <div className="aspect-4/5 overflow-hidden border border-border">
            <img
              src="https://res.cloudinary.com/zmpym9nr/image/upload/v1793016136/WhatsApp_Image_2026-10-26_at_1.01.14_PM_1.jpg"
              alt="DesignFlow interior"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="mb-4 block text-xs uppercase tracking-[0.28em] text-clay">
              Who We Are
            </span>

            <div className="mb-6 h-px w-16 bg-clay" />

            <p className="mb-8 text-base leading-relaxed text-charcoal/80">
              DesignFlow is where interior design
              requests become finished spaces — no
              scattered emails, no lost mood boards.
              From the moment a client submits a
              request to the final install, everyone
              works from one shared, transparent
              process.
            </p>

            <div className="mb-9 flex gap-10">
              <div>
                <p className="font-serif text-3xl text-clay">
                  01
                </p>

                <p className="text-xs uppercase tracking-wide text-muted">
                  Studio
                </p>
              </div>

              <div>
                <p className="font-serif text-3xl text-clay">
                  3
                </p>

                <p className="text-xs uppercase tracking-wide text-muted">
                  Dedicated Roles
                </p>
              </div>

              <div>
                <p className="font-serif text-3xl text-clay">
                  100%
                </p>

                <p className="text-xs uppercase tracking-wide text-muted">
                  Project Visibility
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-block border-b border-clay pb-1 text-sm uppercase tracking-wide text-charcoal transition-opacity hover:opacity-70"
            >
              Read More →
            </Link>
          </div>
        </div>
      </section>

      
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-14 max-w-xl">
            <span className="mb-4 block text-xs uppercase tracking-[0.28em] text-clay">
              What We Do
            </span>

            <h2 className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
              Design, craft, and installation under
              one roof
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {WHAT_WE_DO.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group block border border-border"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-panel">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/50 to-transparent" />

                  <span className="absolute left-5 top-5 font-serif text-sm text-cream">
                    {item.num}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 font-serif text-xl text-charcoal">
                    {item.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-charcoal/70">
                    {item.text}
                  </p>

                  <span className="border-b border-clay pb-0.5 text-xs uppercase tracking-wide text-clay transition-opacity group-hover:opacity-70">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY US ---------- */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => (
            <div
              key={item.title}
              className={`border-cream/10 p-10 ${
                i < WHY_US.length - 1
                  ? "lg:border-r"
                  : ""
              } ${
                i < 2
                  ? "border-b sm:border-b-0"
                  : ""
              }`}
            >
              <p className="mb-5 font-serif text-lg text-amber">
                {item.num}
              </p>

              <h4 className="mb-3 text-sm uppercase tracking-wide">
                {item.title}
              </h4>

              <p className="text-sm leading-relaxed text-cream/60">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- PROCESS + STATS ---------- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-16 max-w-xl">
            <span className="mb-4 block text-xs uppercase tracking-[0.28em] text-clay">
              Our Process
            </span>

            <h2 className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
              From first conversation to finished
              space
            </h2>
          </div>

          <div className="mb-20 grid gap-10 sm:grid-cols-3 lg:grid-cols-5">
            {PROCESS.map((step) => (
              <div key={step.num}>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-clay font-serif text-clay">
                  {step.num}
                </div>

                <h4 className="mb-2 text-sm font-medium text-charcoal">
                  {step.title}
                </h4>

                <p className="text-xs leading-relaxed text-muted">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-border pt-12 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl text-charcoal">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PORTFOLIO ---------- */}
      <section className="overflow-hidden bg-panel/40 py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="mb-4 block text-xs uppercase tracking-[0.28em] text-clay">
                Our Work
              </span>

              <h2 className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
                A little preview of our projects
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  scrollPortfolio(-1)
                }
                aria-label="Previous projects"
                className="flex h-11 w-11 items-center justify-center border border-border transition-colors hover:border-clay hover:text-clay"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollPortfolio(1)
                }
                aria-label="Next projects"
                className="flex h-11 w-11 items-center justify-center border border-border transition-colors hover:border-clay hover:text-clay"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-6 transition-transform duration-500"
            >
              {PORTFOLIO.map((item) => (
                <div
                  key={item.title}
                  className="w-full flex-none md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
                >
                  <div className="aspect-4/5 overflow-hidden border border-border">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="mt-4">
                    <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-clay">
                      {item.tag}
                    </span>

                    <h4 className="font-serif text-lg text-charcoal">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-14 max-w-xl">
            <span className="mb-4 block text-xs uppercase tracking-[0.28em] text-clay">
              Client Words
            </span>

            <h2 className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
              We'll let our clients do the talking
            </h2>
          </div>

          <div className="grid gap-14 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.name}>
                <Quote
                  className="mb-4 text-clay"
                  size={34}
                />

                <p className="mb-6 font-serif text-xl italic leading-relaxed text-charcoal">
                  {testimonial.quote}
                </p>

                <p className="text-xs uppercase tracking-wide text-clay">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 bg-charcoal px-7 py-14 sm:px-12 lg:flex-row lg:items-center lg:px-16 lg:py-20">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.28em] text-amber">
              Ready to begin?
            </span>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl">
              Let's create a space
              <br />
              that feels like yours.
            </h2>
          </div>

          <Link
            to="/register"
            className="shrink-0 bg-amber px-7 py-3.5 text-xs uppercase tracking-wider text-charcoal transition-colors hover:bg-cream"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;