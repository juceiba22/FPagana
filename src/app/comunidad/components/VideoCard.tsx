import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Video } from "../types";
import { MessageSquare, Heart, PlayCircle, ImageIcon, Lock } from "lucide-react";

interface VideoCardProps {
  video: Video;
  likesCount: number;
  commentsCount: number;
  isLocked?: boolean;
}

export function VideoCard({ video, likesCount, commentsCount, isLocked = false }: VideoCardProps) {
  const isImage = video.media_type === "image";

  const badgeLabel = isImage ? "IMAGEN" : video.type === "movie" ? "PELÍCULA" : video.type === "live" ? "EN VIVO" : "VIDEO";
  const badgeColor = isImage ? "bg-green-900/80" : video.type === "live" ? "bg-red-900/80" : video.type === "movie" ? "bg-purple-900/80" : "bg-black/70";

  const previewUrl = isImage ? video.url : video.thumbnail;
  
  const content = (
    <Card className="overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all bg-card/60 backdrop-blur-md border-border/50 group cursor-pointer relative h-full">
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-500 ${isLocked ? 'blur-md opacity-40 scale-110' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {isImage
              ? <ImageIcon className={`w-12 h-12 text-muted-foreground ${isLocked ? 'opacity-20 blur-sm' : 'opacity-50'}`} />
              : <PlayCircle className={`w-12 h-12 text-muted-foreground ${isLocked ? 'opacity-20 blur-sm' : 'opacity-50'}`} />
            }
          </div>
        )}
        
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px]">
            <div className="bg-background/80 p-3 rounded-full mb-3 shadow-lg ring-1 ring-white/10">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
              Disponible al participar
            </span>
          </div>
        )}

        {!isLocked && (
          <div className={`absolute top-2 right-2 ${badgeColor} px-2 py-1 rounded text-xs text-white uppercase font-bold`}>
            {badgeLabel}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col h-[calc(100%-56.25%)]">
        <h3 className="text-lg font-serif text-primary truncate" title={video.title}>
          {isLocked ? "Contenido Exclusivo" : video.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {isLocked ? "Participa para desbloquear" : `Por: ${video.user_id.substring(0, 8)}...`}
        </p>
        
        {!isLocked && (
          <div className="flex items-center gap-4 mt-auto pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  if (isLocked) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <Link href={`/comunidad/video/${video.id}`} className="block h-full">
      {content}
    </Link>
  );
}