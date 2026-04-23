export type VideoType = 'video' | 'live' | 'movie';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  type: VideoType;
  user_id: string;
  created_at: string;
  views: number;
  media_type?: string | null;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  video_id: string;
}
