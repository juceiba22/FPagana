import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Video } from "../types";
import { MessageSquare, Heart, PlayCircle, ImageIcon } from "lucide-react";

interface VideoCardProps {
  video: Video;
  likesCount: number;
  commentsCount: number;
}

export function VideoCard({ video, likesCount, commentsCount }: VideoCardProps) {
  const isImage = video.media_type === "image";

  const badgeLabel = isImage ? "IMAGEN" : video.type === "movie" ? "PELÍCULA" : video.type === "live" ? "EN VIVO" : "VIDEO";
  const badgeColor = isImage ? "bg-green-900/80" : video.type === "live" ? "bg-red-900/80" : video.type === "movie" ? "bg-purple-900/80" : "bg-black/70";

  const previewUrl = isImage ? video.url : video.thumbnail;

  return (
    <Link href={`/comunidad/video/${video.id}`}>
      <Card className="overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all bg-card/60 backdrop-blur-md border-border/50 group cursor-pointer">
        <div className="relative aspect-video bg-black/50">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={video.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              {isImage
                ? <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
                : <PlayCircle className="w-12 h-12 text-muted-foreground opacity-50" />
              }
            </div>
          )}
          <div className={`absolute top-2 right-2 ${badgeColor} px-2 py-1 rounded text-xs text-white uppercase font-bold`}>
            {badgeLabel}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-serif text-primary truncate" title={video.title}>
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Por: {video.user_id.substring(0, 8)}...
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}