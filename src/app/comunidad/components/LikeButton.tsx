"use client";

import { useState, useEffect } from "react";
import { useComunidad } from "../hooks/useComunidad";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function LikeButton({ videoId, userId }: { videoId: string; userId: string | null }) {
  const { toggleLike, getLikes } = useComunidad();
  const supabase = createClient();
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchLikes = async () => {
      const likes = await getLikes(videoId);
      if (active) {
        setLikesCount(likes.length);
        if (userId) {
          setHasLiked(likes.some(l => l.user_id === userId));
        }
        setIsLoading(false);
      }
    };
    fetchLikes();

    const channel = supabase
      .channel(`likes-${videoId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes", filter: `video_id=eq.${videoId}` },
        () => {
          fetchLikes(); // refetch on change
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [videoId, userId, getLikes, supabase]);

  const handleLike = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para dar like");
      return;
    }
    
    // Optimistic update
    setHasLiked(!hasLiked);
    setLikesCount(prev => hasLiked ? prev - 1 : prev + 1);
    
    try {
      await toggleLike(videoId, userId);
    } catch (error) {
      console.error(error);
      // Revert on error
      setHasLiked(!hasLiked);
      setLikesCount(prev => hasLiked ? prev + 1 : prev - 1);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`gap-2 ${hasLiked ? "text-red-500 border-red-500 hover:bg-red-500/10" : ""}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
      <span>{likesCount}</span>
    </Button>
  );
}
