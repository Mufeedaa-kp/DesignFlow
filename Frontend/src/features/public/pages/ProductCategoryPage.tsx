import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import HeroBanner from "./HeroBanner";
import Lightbox from "./Lightbox";
import { PRODUCT_CATEGORIES } from "./productCategories";

const ProductCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const category = PRODUCT_CATEGORIES.find(
    (category) => category.slug === slug
  );

  const [activeWorkId, setActiveWorkId] = useState<string | null>(
    null
  );

  if (!category) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }

  const activeWork = category.works.find(
    (work) => work.id === activeWorkId
  );

  return (
    <div>
      <HeroBanner
  label="Products"
  quote={category.title}
  image={category.image}
/>

      {/* Intro */}

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
          <h2 className="font-serif text-3xl text-charcoal mb-5">
            {category.title}
          </h2>

          <p className="text-base leading-relaxed text-charcoal/80">
            {category.intro}
          </p>
        </div>
      </section>


      {/* Works */}

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">

          <span className="block text-xs uppercase tracking-[0.28em] text-clay mb-8 text-center">
            Our Work
          </span>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.works.map((work) => (
              <button
                key={work.id}
                type="button"
                onClick={() => setActiveWorkId(work.id)}
                aria-label={`View ${work.title}`}
                className="group aspect-square overflow-hidden bg-linear-to-br from-panel to-surface border border-border hover:opacity-90 transition-opacity"
              >
                {work.image ? (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-panel to-surface" />
                )}
              </button>
            ))}
          </div>

        </div>
      </section>


      {/* Lightbox */}

      {activeWork && (
        <Lightbox
          title={activeWork.title}
          image={activeWork.image}
          onClose={() => setActiveWorkId(null)}
        />
      )}
    </div>
  );
};

export default ProductCategoryPage;