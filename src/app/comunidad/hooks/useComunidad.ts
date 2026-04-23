import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Video, Comment, Like } from '../types';

export function useComunidad() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideos = useCallback(async (): Promise<Video[]> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    setLoading(false);
    if (error) {
      setError(error.message);
      return [];
    }
    return data || [];
  }, []);

  const getVideoById = useCallback(async (id: string): Promise<Video | null> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
      
    setLoading(false);
    if (error) {
      setError(error.message);
      return null;
    }
    return data;
  }, []);

  const getComments = useCallback(async (videoId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  }, []);

  const getLikes = useCallback(async (videoId: string): Promise<Like[]> => {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('video_id', videoId);
      
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  }, []);

  const addComment = async (videoId: string, userId: string, content: string, parentId?: string) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        video_id: videoId,
        user_id: userId,
        content,
        parent_id: parentId || null
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Comment;
  };

  const toggleLike = async (videoId: string, userId: string) => {
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { error } = await supabase.from('likes').delete().eq('id', existing.id);
      if (error) throw error;
      return false; // unliked
    } else {
      const { error } = await supabase.from('likes').insert({ video_id: videoId, user_id: userId });
      if (error) throw error;
      return true; // liked
    }
  };

  const uploadVideo = async (payload: Omit<Video, 'id' | 'created_at' | 'views'>) => {
    const { data, error } = await supabase
      .from('videos')
      .insert(payload)
      .select()
      .single();
      
    if (error) throw error;
    return data as Video;
  };

  const incrementViews = async (videoId: string) => {
    // Note: To do this properly requires an RPC function because we don't know the exact current value safely in a high-concurrency environment.
    // Since we don't have an RPC, we will fetch and update, or just ignore for the MVP as it was not explicitly requested (only the column was).
  };

  return {
    loading,
    error,
    getVideos,
    getVideoById,
    getComments,
    getLikes,
    addComment,
    toggleLike,
    uploadVideo,
  };
}
