import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function StaffChatPage() {
  const supabase = await createClient();
  const { data: channels, error } = await supabase.from("channels").select("*").order("name");

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-primary drop-shadow-lg">Canales de Staff</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Selecciona el canal correspondiente a tu labor en el ritual.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-md">
            Error cargando los canales. Asegúrate de haber ejecutado la migración SQL.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {channels?.map((channel) => (
            <Link key={channel.id} href={`/staff/chat/${channel.name}`} className="block group">
              <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2 flex flex-col text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
                <CardHeader className="pt-8">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 shadow-[0_0_15px_-3px_rgba(128,0,32,0.4)] group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-serif tracking-wide text-foreground group-hover:text-secondary transition-colors capitalize">
                    {channel.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
          
          {channels?.length === 0 && !error && (
            <div className="col-span-full text-center text-muted-foreground">
              No hay canales disponibles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
