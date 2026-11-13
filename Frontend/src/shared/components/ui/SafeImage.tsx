import { useState } from "react";
import { ImageOff } from "lucide-react";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

const isImageSource = (value: string) => {
  return /^((https?:)?\/\/|data:image\/|blob:|\/)/i.test(
    value.trim()
  );
};

const SafeImage = ({
  src,
  alt,
  className = "",
  fallbackClassName = "",
}: SafeImageProps) => {
  const [failedSource, setFailedSource] =
    useState<string | null>(null);

  const hasValidSource =
    typeof src === "string" &&
    isImageSource(src);

  if (!hasValidSource || failedSource === src) {
    return (
      <div
        className={`flex items-center justify-center bg-panel text-muted ${className} ${fallbackClassName}`}
        role="img"
        aria-label={`${alt} unavailable`}
      >
        <ImageOff size={20} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
};

export default SafeImage;
