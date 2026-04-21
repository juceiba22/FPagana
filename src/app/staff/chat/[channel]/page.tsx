import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ClientChat } from "./client-chat";

export default async function ChannelChatPage({ params }: { params: Promise<{ channel: string }> }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const channelName = resolvedParams.channel;

  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login");
  }

  // Fetch channel ID to ensure it exists and get the UUID for the foreign key
  const { data: channel, error: channelError } = await supabase
    .from("channels")
    .select("id, name")
    .eq("name", channelName)
    .single();

  if (channelError || !channel) {
    // If someone goes to /staff/chat/invalid_channel
    notFound();
  }

  return (
    <ClientChat 
      channelId={channel.id} 
      channelName={channel.name} 
      userId={user.id} 
    />
  );
}
