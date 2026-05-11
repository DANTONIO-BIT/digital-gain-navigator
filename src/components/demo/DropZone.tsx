import { useRef, useCallback } from "react";
import gsap from "gsap";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFile: (file: File) => void;
  loading?: boolean;
  error?: string | null;
}

const ACCEPTED = ["xlsx", "xls", "csv"];

const DropZone = ({ onFile, loading, error }: DropZoneProps) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ACCEPTED.includes(ext)) return;
      onFile(file);
    },
    [onFile]
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to(zoneRef.current, { borderColor: "#A05730", scale: 1.015, duration: 0.2 });
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to(zoneRef.current, { borderColor: "#E0DAD3", scale: 1, duration: 0.2 });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to(zoneRef.current, { borderColor: "#E0DAD3", scale: 1, duration: 0.2 });
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        ref={zoneRef}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !loading && inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-4 py-16 px-8 border-2 border-dashed transition-colors"
        style={{
          borderColor: "#E0DAD3",
          background: "#FFFFFF",
          cursor: loading ? "default" : "pointer",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {loading ? (
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 border-2 border-[#A05730] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-mono text-[#A05730]">Procesando archivo...</span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-[#C5C2BE]" strokeWidth={1.5} />
            <div className="text-center">
              <div className="font-semibold text-[#1A1A1A] mb-1">Arrastra tu archivo aquí</div>
              <div className="text-sm text-[#A09590]">o haz clic para seleccionar</div>
            </div>
            <div className="label" style={{ color: "#C5C2BE" }}>
              .xlsx · .xls · .csv
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />
        <span className="text-[10px] font-mono text-[#A09590]">
          Los datos no salen de tu navegador — procesado 100% local
        </span>
      </div>

      {error && (
        <div className="mt-3 text-xs font-mono text-red-500 border border-red-200 px-3 py-2 bg-red-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default DropZone;
