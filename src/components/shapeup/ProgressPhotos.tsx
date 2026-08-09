import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Plus, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET = "progress-photos";

type Photo = { path: string; url: string; date: string };

function fmt(d: Date) {
  return d.toLocaleDateString("pt-BR");
}

export function ProgressPhotos({ days }: { days: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(uid, { limit: 100, sortBy: { column: "name", order: "asc" } });
    if (error || !data) {
      setLoading(false);
      return;
    }
    const files = data.filter((f) => f.name !== ".emptyFolderPlaceholder");
    const signed = await Promise.all(
      files.map(async (f) => {
        const path = `${uid}/${f.name}`;
        const { data: s } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
        const ts = Number(f.name.split("-")[0]);
        return {
          path,
          url: s?.signedUrl ?? "",
          date: Number.isFinite(ts) ? fmt(new Date(ts)) : "",
        };
      }),
    );
    setPhotos(signed.filter((p) => p.url));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) {
      toast.error("Entre na sua conta para enviar fotos.");
      return;
    }
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error("Envie apenas imagens.");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Cada foto deve ter no máximo 10MB.");
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) toast.error("Não foi possível enviar a foto.");
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    await load();
    toast.success("Foto adicionada!");
  }

  async function remove(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      toast.error("Não foi possível remover a foto.");
      return;
    }
    setPhotos((p) => p.filter((x) => x.path !== path));
    toast.success("Foto removida.");
  }

  const first = photos[0];
  const last = photos.length > 1 ? photos[photos.length - 1] : undefined;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Slot photo={first} fallback="👤" loading={loading} onRemove={remove} />
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-full border-2 border-primary flex items-center justify-center text-primary-glow">
            <ArrowRight size={20} />
          </div>
          <div className="text-3xl font-bold leading-none">{days}</div>
          <div className="text-xs text-muted-foreground">dias</div>
          <div className="text-[10px] text-muted-foreground">de evolução</div>
        </div>
        <Slot photo={last} fallback="💪" loading={loading} onRemove={remove} />
      </div>

      {photos.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p) => (
            <div key={p.path} className="relative shrink-0">
              <img
                src={p.url}
                alt={`Foto de progresso ${p.date}`}
                loading="lazy"
                className="h-20 w-16 rounded-lg object-cover border border-border"
              />
              <button
                onClick={() => void remove(p.path)}
                aria-label="Remover foto"
                className="absolute top-1 right-1 rounded bg-background/80 p-1 text-muted-foreground hover:text-foreground"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void onFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm text-primary-glow hover:bg-primary/10 transition disabled:opacity-60"
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        {uploading ? "Enviando..." : "Adicionar nova foto"}
      </button>
    </div>
  );
}

function Slot({
  photo,
  fallback,
  loading,
  onRemove,
}: {
  photo?: Photo;
  fallback: string;
  loading: boolean;
  onRemove: (path: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 aspect-[3/4] flex flex-col items-center justify-end p-3 relative overflow-hidden">
      {photo ? (
        <>
          <img
            src={photo.url}
            alt={`Foto de progresso de ${photo.date}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute top-2 left-2 z-10 text-xs rounded bg-background/70 px-2 py-0.5">
            {photo.date}
          </span>
          <button
            onClick={() => onRemove(photo.path)}
            aria-label="Remover foto"
            className="absolute top-2 right-2 z-10 rounded bg-background/70 p-1.5 text-muted-foreground hover:text-foreground"
          >
            <Trash2 size={12} />
          </button>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <div className="text-5xl opacity-30">{fallback}</div>
              <div className="text-[10px] flex items-center gap-1">
                <ImageIcon size={11} /> sem foto ainda
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
