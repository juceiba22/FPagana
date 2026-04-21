-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed channels
INSERT INTO channels (name) VALUES 
    ('vestuario'),
    ('musica'),
    ('actuacion'),
    ('direccion')
ON CONFLICT (name) DO NOTHING;

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    media_url TEXT,
    media_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Channels policies: anyone authenticated can read
CREATE POLICY "Channels are viewable by authenticated users" 
ON channels FOR SELECT 
TO authenticated 
USING (true);

-- Messages policies: anyone authenticated can read and insert
CREATE POLICY "Messages are viewable by authenticated users" 
ON messages FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Messages can be inserted by authenticated users" 
ON messages FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Enable Realtime for messages (REPLICA IDENTITY FULL for safety if needed, but not strictly required for append-only chat unless doing updates/deletes)
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Add to supabase_realtime publication
BEGIN;
  -- Remove if already exists to avoid errors
  -- (Optionally, could just try to add and ignore error)
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Create storage bucket for chat media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Storage RLS for 'chat-media'
CREATE POLICY "Public Read Access for chat media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-media');

CREATE POLICY "Authenticated users can upload chat media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'chat-media' AND 
    auth.role() = 'authenticated'
);
