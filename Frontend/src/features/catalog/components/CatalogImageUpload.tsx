import { useState } from "react";

interface CatalogImageUploadProps {
  onUpload: (files: File[]) => void;
  isUploading?: boolean;
}

const CatalogImageUpload = ({
  onUpload,
  isUploading = false,
}: CatalogImageUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    setError("");

    if (files.length === 0) {
      return;
    }

    if (files.length > 10) {
      setError("You can upload a maximum of 10 images.");
      return;
    }

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError("Only image files are allowed.");
      return;
    }

    const largeFile = files.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (largeFile) {
      setError("Each image must be smaller than 10MB.");
      return;
    }

    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    onUpload(selectedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-[#D9C7A3] bg-[#F8F6F2] p-6 text-center">
        <input
          id="catalog-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="catalog-images"
          className="inline-flex cursor-pointer rounded-lg bg-[#8B5E3C] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Choose Images
        </label>

        <p className="mt-2 text-sm text-gray-500">
          Upload up to 10 images. Maximum 10MB each.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Selected Images ({selectedFiles.length})
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {selectedFiles.map((file) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-32 w-full object-cover"
                />

                <p className="truncate px-2 py-2 text-xs text-gray-500">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="rounded-lg bg-[#8B5E3C] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogImageUpload;