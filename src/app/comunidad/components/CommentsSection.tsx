"use client";

import { useState, useEffect, useRef } from "react";
import { useComunidad } from "../hooks/useComunidad";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Comment } from "../types";
import { Send, Loader2 } from "lucide-react";

interface CommentsSectionProps {
  videoId: string;
  userId: string | null;
}

export function CommentsSection({ videoId, userId }: CommentsSectionProps) {
  const { getComments, addComment } = useComunidad();
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    
    const fetchComments = async () => {
      const data = await getComments(videoId);
      if (active) {
        setComments(data);
        setIsLoading(false);
      }
    };
    
    fetchComments();

    const channel = supabase
      .channel(`comments-${videoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `video_id=eq.${videoId}` },
        (payload) => {
          const newComment = payload.new as Comment;
          setComments((prev) => {
            if (prev.some((c) => c.id === newComment.id)) return prev;
            return [...prev, newComment];
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [videoId, getComments, supabase]);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!userId) {
      alert("Debes iniciar sesión para comentar");
      return;
    }
    
    const text = parentId ? (document.getElementById(`reply-input-${parentId}`) as HTMLInputElement)?.value : content;
    if (!text?.trim()) return;

    setIsSubmitting(true);
    
    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      video_id: videoId,
      user_id: userId,
      content: text.trim(),
      parent_id: parentId,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [...prev, optimisticComment]);
    if (!parentId) setContent("");
    else {
      const input = document.getElementById(`reply-input-${parentId}`) as HTMLInputElement;
      if (input) input.value = "";
      setReplyingTo(null);
    }

    try {
      const inserted = await addComment(videoId, userId, text.trim(), parentId || undefined);
      setComments(prev => prev.map(c => c.id === tempId ? inserted : c));
    } catch (error) {
      console.error(error);
      alert("Error al enviar el comentario");
      setComments(prev => prev.filter(c => c.id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build threads
  const mainComments = comments.filter(c => !c.parent_id);
  
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-serif text-primary">Comentarios ({comments.length})</h3>
      
      {/* Main input */}
      <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-grow bg-background border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={!userId || isSubmitting}
        />
        <Button
          type="submit"
          className="bg-primary text-primary-foreground"
          disabled={!userId || isSubmitting || !content.trim()}
        >
          {isSubmitting && !replyingTo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
      {!userId && <p className="text-xs text-muted-foreground mt-1">Inicia sesión para comentar.</p>}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : mainComments.length === 0 ? (
        <p className="text-muted-foreground italic text-sm">Aún no hay comentarios. Sé el primero.</p>
      ) : (
        <div className="space-y-4 mt-6">
          {mainComments.map(comment => (
            <div key={comment.id} className="p-4 rounded-lg bg-card/60 border border-border/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-primary">{comment.user_id.substring(0,8)}...</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              
              <div className="mt-2">
                <button 
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Responder
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmit(e, comment.id)} className="flex gap-2 mt-3 ml-4">
                  <input
                    id={`reply-input-${comment.id}`}
                    type="text"
                    placeholder="Escribe una respuesta..."
                    className="flex-grow bg-background border border-border/50 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!userId || isSubmitting}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary text-primary-foreground h-auto py-1.5"
                    disabled={!userId || isSubmitting}
                  >
                     <Send className="w-3 h-3" />
                  </Button>
                </form>
              )}

              {/* Replies */}
              <div className="ml-6 border-l-2 border-border/50 pl-4 mt-3 space-y-3">
                {comments.filter(c => c.parent_id === comment.id).map(reply => (
                  <div key={reply.id} className="py-2">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-primary opacity-80">{reply.user_id.substring(0,8)}...</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(reply.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
