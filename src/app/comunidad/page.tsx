import { createClient } from "@/lib/supabase/server";
import { VideoCard } from "./components/VideoCard";
import { Video } from "./types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ComunidadPage() {
  const supabase = await createClient();

  // Fetch videos
  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  // Ideally we would fetch counts via an RPC or a View, but since we can't alter that easily here
  // without creating more SQL, we will fetch the related counts manually or lazily.
  // Actually, for MVP let's fetch likes and comments to count them.
  const { data: likes } = await supabase.from("likes").select("video_id");
  const { data: comments } = await supabase.from("comments").select("video_id");

  const getLikesCount = (videoId: string) => likes?.filter(l => l.video_id === videoId).length || 0;
  const getCommentsCount = (videoId: string) => comments?.filter(c => c.video_id === videoId).length || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-primary">Comunidad</h1>
            <p className="text-muted-foreground mt-2">
              Explora contenido, comparte tus experiencias y participa en la Fiesta Pagana.
            </p>
          </div>
          <Link href="/comunidad/subir">
            <Button className="bg-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Abrir Debate
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
            Error cargando los videos: {error.message}
          </div>
        )}

        {videos && videos.length === 0 && (
          <div className="py-12 text-center border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground italic mb-4">Aún no hay videos en la comunidad.</p>
            <Link href="/comunidad/subir">
              <Button variant="outline">Sé el primero en subir uno</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) => (
            <VideoCard
              key={video.id}
              video={video as Video}
              likesCount={getLikesCount(video.id)}
              commentsCount={getCommentsCount(video.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
