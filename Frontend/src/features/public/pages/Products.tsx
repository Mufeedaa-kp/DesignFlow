import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "./productCategories";

const Products = () => (
  <div>
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        <div className="max-w-xl mb-14">
          <span className="block text-xs uppercase tracking-[0.28em] text-clay mb-4">
            Products
          </span>

          <h1 className="font-serif text-4xl text-charcoal leading-tight">
            What we design and build
          </h1>
        </div>


        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products/${cat.slug}`}
              className="group block border border-border bg-surface"
            >

              {/* Category Image */}

              <div className="aspect-4/5 overflow-hidden bg-linear-to-br from-panel to-surface">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-panel to-surface" />
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