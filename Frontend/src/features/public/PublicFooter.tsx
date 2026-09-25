import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 border-b border-cream/10 px-6 py-16 sm:px-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="mb-4 font-serif text-xl text-cream">
            Design
            <span className="text-amber">
              Flow
            </span>
          </p>

          <p className="max-w-xs text-sm leading-relaxed text-cream/60">
            An interior design studio platform
            bringing requests, designers, and clients
            into one guided process.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-amber">
            Main Pages
          </p>

          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/"
                className="transition-colors hover:text-cream"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="transition-colors hover:text-cream"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="transition-colors hover:text-cream"
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="transition-colors hover:text-cream"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>


        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-amber">
            Products
          </p>

          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                to="/products/modular-kitchen"
                className="transition-colors hover:text-cream"
              >
                Modular Kitchen
              </Link>
            </li>

            <li>
              <Link
                to="/products/furniture"
                className="transition-colors hover:text-cream"
              >
                Furniture
              </Link>
            </li>

            <li>
              <Link
                to="/products/wardrobe"
                className="transition-colors hover:text-cream"
              >
                Wardrobe
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-amber">
            Contact
          </p>

          <ul className="space-y-2.5 text-sm text-cream/60">
            <li>
              hello@designflow.studio
            </li>
            <li>+91 495 000 0000</li>
            <li>Malappuram, Kerala</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
        <p className="text-xs text-cream/50">
          © {new Date().getFullYear()} DesignFlow.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;