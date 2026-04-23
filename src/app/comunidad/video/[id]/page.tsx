import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PlayerWrapper } from "../../components/PlayerWrapper";
import { LikeButton } from "../../components/LikeButton";
import { CommentsSection } from "../../components/CommentsSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: video, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !video) {
    notFound();
  }

  // Opcional: Incrementar vistas (solo si no falla por RLS, o ignorar el error)
  // supabase.rpc('increment_views', { video_id: params.id })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <Link href="/comunidad">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Comunidad
          </Button>
        </Link>

        <PlayerWrapper url={video.url} thumbnail={video.thumbnail} mediaType={video.media_type} />

        <div className="mt-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-primary">{video.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Subido por: {video.user_id.substring(0, 8)}... • {new Date(video.created_at).toLocaleDateString()}
            </p>
            {video.description && (
              <p className="mt-4 text-sm whitespace-pre-wrap opacity-90 leading-relaxed bg-card/50 p-4 rounded-md border border-border/50">
                {video.description}
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            <LikeButton videoId={video.id} userId={user?.id || null} />
          </div>
        </div>

        <hr className="my-8 border-border/50" />

        <CommentsSection videoId={video.id} userId={user?.id || null} />
      </div>
    </div>
  );
}
