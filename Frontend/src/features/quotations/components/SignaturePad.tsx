import {
  useEffect,
  useRef,
  useState,
} from "react";

interface SignaturePadProps {
  onChange: (signature: string) => void;
  disabled?: boolean;
}

const SignaturePad = ({
  onChange,
  disabled = false,
}: SignaturePadProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] =
    useState(false);

  const getCanvasPosition = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect =
      canvas.getBoundingClientRect();

    if ("touches" in event) {
      const touch = event.touches[0];

      return {
        x:
          touch.clientX -
          rect.left,
        y:
          touch.clientY -
          rect.top,
      };
    }

    return {
      x:
        event.clientX -
        rect.left,
      y:
        event.clientY -
        rect.top,
    };
  };

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (disabled) return;

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const { x, y } =
      getCanvasPosition(event);

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
  };

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || disabled) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    const { x, y } =
      getCanvasPosition(event);

    ctx.lineTo(x, y);

    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;

    if (!canvas) return;

    onChange(
      canvas.toDataURL("image/png")
    );
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    onChange("");
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#3F332A";
  }, []);

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-md border border-[#D9C7A3] bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={220}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`h-44 w-full touch-none ${
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-crosshair"
          }`}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8A7A6B]">
          Sign inside the box
        </p>

        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled}
          className="text-xs font-medium text-[#8B5E3C] hover:underline disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;