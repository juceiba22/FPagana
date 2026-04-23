"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useComunidad } from "../hooks/useComunidad";
import { VideoType } from "../types";

export default function SubirVideoPage() {
  const supabase = createClient();
  const router = useRouter();
  const { uploadVideo } = useComunidad();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<"video" | "image">("video");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    type: "video" as VideoType,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/comunidad/subir");
      } else {
        setUserId(user.id);
      }
      setLoading(false);
    };
    checkUser();
  }, [supabase, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);

    try {
      let finalUrl = formData.url;

      if (mediaType === "image" && imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("community-images")
          .upload(path, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("community-images")
          .getPublicUrl(path);

        finalUrl = publicData.publicUrl;
      }

      await uploadVideo({
        ...formData,
        url: finalUrl,
        user_id: userId,
        thumbnail: formData.thumbnail || null,
        description: formData.description || null,
        media_type: mediaType,
      });

      router.push("/comunidad");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al subir el contenido. Verificá los datos e intentá de nuevo.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
        <Link href="/comunidad">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Comunidad
          </Button>
        </Link>

        <Card className="p-6 bg-card/60 backdrop-blur-md border-border/50">
          <h1 className="text-3xl font-serif text-primary mb-6">Compartir Contenido</h1>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMediaType("video")}
              className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${mediaType === "video" ? "bg-primary/20 border-primary/50 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"}`}
            >
              Video
            </button>
            <button
              type="button"
              onClick={() => setMediaType("image")}
              className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${mediaType === "image" ? "bg-primary/20 border-primary/50 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"}`}
            >
              Imagen
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Título *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-background border border-border/50 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                placeholder="Ej. Ensayo general Acto 1"
              />
            </div>

            {mediaType === "video" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">URL del Video *</label>
                  <input
                    required
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-background border border-border/50 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Ej. https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">Soporta YouTube, Vimeo, o URLs directas a .mp4</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">URL del Thumbnail (Opcional)</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full bg-background border border-border/50 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Ej. https://midominio.com/imagen.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Contenido</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as VideoType })}
                    className="w-full bg-background border border-border/50 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="video">Video Normal</option>
                    <option value="movie">Película Corto/Largo</option>
                    <option value="live">Transmisión en Vivo</option>
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Imagen *</label>
                <input
                  required={mediaType === "image"}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-background border border-border/50 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary outline-none text-sm text-muted-foreground"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-3 rounded-md max-h-48 object-contain border border-border/50" />
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Descripción (Opcional)</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-background border border-border/50 rounded-md px-4 py-2 min-h-[100px] focus:ring-1 focus:ring-primary outline-none"
                placeholder="Agrega contexto a tu contenido..."
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Publicar ${mediaType === "image" ? "Imagen" : "Video"}`}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}