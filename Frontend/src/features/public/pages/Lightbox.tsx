import { X } from "lucide-react";

interface LightboxProps {
  title: string;
  image?: string;
  onClose: () => void;
}

const Lightbox = ({
  title,
  image,
  onClose,
}: LightboxProps) => (
  <div
    className="fixed inset-0 z-60 bg-charcoal/90 flex items-center justify-center p-6"
    onClick={onClose}
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute top-6 right-6 text-cream hover:text-amber transition-colors"
    >
      <X size={26} />
    </button>

    <div
      className="max-w-3xl w-full aspect-4/3 bg-linear-to-br from-panel to-surface border border-cream/20 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-end p-6">
          <span className="text-xs uppercase tracking-[0.2em] text-charcoal/70">
            {title}
          </span>
        </div>
      )}

      {image && (
        <div className="absolute bottom-8 left-8">
          <span className="text-xs uppercase tracking-[0.2em] text-cream">
            {title}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default Lightbox;