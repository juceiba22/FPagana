-- 1. Ensure REPLICA IDENTITY is set to FULL so that all row data is broadcasted correctly.
ALTER TABLE messages REPLICA IDENTITY FULL;

-- 2. Drop the existing publication just in case it is misconfigured or stale.
DROP PUBLICATION IF EXISTS supabase_realtime;

-- 3. Recreate the publication. Supabase listens specifically to 'supabase_realtime'.
CREATE PUBLICATION supabase_realtime;

-- 4. Add the messages table to the publication so that INSERTs are broadcasted.
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
