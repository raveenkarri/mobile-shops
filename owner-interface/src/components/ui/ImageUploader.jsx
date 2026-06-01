import { useEffect, useMemo, useRef } from "react";
import { Camera, ImagePlus, Trash2, UploadCloud } from "lucide-react";

export default function ImageUploader({ files, setFiles, maxFiles = 8 }) {
  const inputRef = useRef(null);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const addFiles = (incoming) => {
    const valid = incoming.filter((file) => file.type.startsWith("image/"));
    if (!valid.length) return;
    setFiles((prev) => [...prev, ...valid].slice(0, maxFiles));
  };

  const handleInputChange = (event) => {
    addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    addFiles(Array.from(event.dataTransfer.files || []));
  };

  const removeFile = (targetIndex) => {
    setFiles((prev) => prev.filter((_, index) => index !== targetIndex));
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="rounded-2xl border-2 border-dashed border-app bg-base p-5 text-center transition hover:border-accent"
      >
        <UploadCloud className="mx-auto mb-2 text-accent" size={24} />
        <p className="text-sm font-semibold text-primary">Drag and drop images here</p>
        <p className="mt-1 text-xs text-muted">or click to browse files ({files.length}/{maxFiles})</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-app bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-accent">
          <ImagePlus size={16} />
          Upload Images
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInputChange} />
        </label>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-app bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-accent">
          <Camera size={16} />
          Use Camera
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
        </label>
      </div>

      {files.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map(({ file, url }, index) => (
            <div key={`${file.name}-${index}`} className="group relative overflow-hidden rounded-2xl border border-app">
              <img src={url} alt={file.name} className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1 inline-flex rounded-lg bg-black/65 p-1.5 text-white opacity-90 transition hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
