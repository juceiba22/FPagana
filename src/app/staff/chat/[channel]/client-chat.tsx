"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type Message = {
  id: string;
  channel_id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
};

// Simple User Map (for displaying emails). Supabase doesn't let us query auth.users directly from client.
// We'll just display User ID for now, or if we had a profiles table we could join it.
// The user didn't ask for a profiles table, just "user (email or id)". We will show user_id.

export function ClientChat({ channelId, channelName, userId }: { channelId: string, channelName: string, userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let active = true;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else if (active && data) {
        setMessages(data);
        setIsLoading(false);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel(`staff-chat-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(subscription);
    };
  }, [channelId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setIsUploading(true);
    let media_url = null;
    let media_type = null;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${channelName}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("chat-media")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        alert("Error uploading image");
        setIsUploading(false);
        return;
      }

      media_url = supabase.storage.from("chat-media").getPublicUrl(filePath).data.publicUrl;
      media_type = "image";
    }

    const { error: insertError } = await supabase.from("messages").insert({
      channel_id: channelId,
      user_id: userId,
      content: content.trim() || null,
      media_url,
      media_type,
    });

    if (insertError) {
      console.error("Error sending message:", insertError);
      alert("Error sending message");
    } else {
      setContent("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-serif text-primary capitalize">Canal: {channelName}</h2>
          <p className="text-sm text-muted-foreground">Colaboración de staff</p>
        </div>
        <Link href="/staff/chat">
          <Button variant="outline">Volver a Canales</Button>
        </Link>
      </div>

      <Card className="flex flex-col flex-grow overflow-hidden bg-card/60 backdrop-blur-md border-border/50">
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 space-y-4"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground italic">
              Aún no hay mensajes en este canal. Escribe el primero.
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.user_id === userId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`text-xs text-muted-foreground mb-1 px-1 ${isMine ? 'text-right' : 'text-left'}`}>
                    {isMine ? 'Tú' : msg.user_id.substring(0, 8) + '...'} <span className="opacity-50">({new Date(msg.created_at).toLocaleTimeString()})</span>
                  </div>
                  <div className={`max-w-[75%] rounded-2xl p-3 ${isMine ? 'bg-primary/20 text-foreground border border-primary/20' : 'bg-secondary/10 text-foreground border border-secondary/20'}`}>
                    {msg.media_url && (
                      <div className="mb-2 rounded-xl overflow-hidden bg-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={msg.media_url} 
                          alt="adjunto" 
                          className="max-w-full h-auto max-h-64 object-contain" 
                        />
                      </div>
                    )}
                    {msg.content && <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-background/50 border-t border-border/50">
          <form onSubmit={handleSend} className="flex gap-2 items-end">
            <div className="flex-grow flex flex-col gap-2">
              {file && (
                <div className="text-xs bg-primary/20 text-primary px-2 py-1 flex items-center gap-2 rounded self-start truncate max-w-full">
                  <ImageIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} className="ml-1 opacity-70 hover:opacity-100 font-bold">&times;</button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-grow bg-background border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isUploading}
                />
                
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  disabled={isUploading}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_10px_-2px_rgba(212,175,55,0.4)]"
              disabled={isUploading || (!content.trim() && !file)}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
