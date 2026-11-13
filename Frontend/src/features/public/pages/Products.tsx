import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "./productCategories";
import HeroBanner from "./HeroBanner";

const Products = () => (
  <div>
    <HeroBanner
      label="Products"
      quote={"What we design\nand build"}
      image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
    />

    <section className="section">
      <div className="container-page">

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCT_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/products/${cat.slug}`}
              className="reveal-on-scroll group block border border-border bg-surface"
              style={{ "--reveal-delay": `${0.12 + idx * 0.08}s` } as React.CSSProperties}
            >

              {/* Category Image */}

              <div className="aspect-[7/8] overflow-hidden bg-linear-to-br from-panel to-surface">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-brown-dark)]" />
                )}
              </div>


              {/* Category Details */}

              <div className="p-6">
                <h3 className="font-serif text-xl text-charcoal mb-2">
                  {cat.title}
                </h3>

                <span className="text-xs uppercase tracking-wide text-clay border-b border-clay pb-0.5 group-hover:opacity-70 transition-opacity">
                  View →
                </span>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  </div>
);

export default Products;