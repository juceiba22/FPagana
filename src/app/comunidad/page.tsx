import { createClient } from "@/lib/supabase/server";
import { VideoCard } from "./components/VideoCard";
import { Video } from "./types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Sparkles, Clock, CalendarDays, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ComunidadPage() {
  const supabase = await createClient();

  // Fetch only the latest 8 videos for "Lo nuevo" to avoid infinite scroll and keep batches limited
  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  // Fetch counts
  const { data: likes } = await supabase.from("likes").select("video_id");
  const { data: comments } = await supabase.from("comments").select("video_id");

  const getLikesCount = (videoId: string) => likes?.filter(l => l.video_id === videoId).length || 0;
  const getCommentsCount = (videoId: string) => comments?.filter(c => c.video_id === videoId).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="relative z-20 text-center space-y-6 px-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-serif text-primary tracking-tight">Comunidad</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Un espacio abierto para participar, descubrir y conectar
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="#lo-nuevo" className="w-full sm:w-auto">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14 rounded-full w-full group">
                Entrar a la comunidad
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#explorar" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 text-lg px-8 h-14 rounded-full w-full">
                Explorar contenido
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* GATEWAY NAVIGATION */}
      <section className="py-16 px-4 md:px-6 relative z-20 -mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="#explorar" className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[4/3] flex items-end p-8 border border-white/5 hover:border-primary/30 transition-all bg-card/40 backdrop-blur-sm hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-20 w-full transform group-hover:translate-y-[-8px] transition-transform duration-300">
              <Compass className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-2xl font-serif text-white mb-2">Explorar</h3>
              <p className="text-white/60 text-sm">Descubre el universo pagano</p>
            </div>
          </Link>

          <Link href="#lo-nuevo" className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[4/3] flex items-end p-8 border border-white/5 hover:border-primary/30 transition-all bg-card/40 backdrop-blur-sm hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/10 transition-colors" />
            <div className="relative z-20 w-full transform group-hover:translate-y-[-8px] transition-transform duration-300">
              <Clock className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-white mb-2">Lo nuevo</h3>
              <p className="text-white/60 text-sm">Últimos aportes y debates</p>
            </div>
          </Link>

          <Link href="#experiencias" className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[4/3] flex items-end p-8 border border-white/5 hover:border-primary/30 transition-all bg-card/40 backdrop-blur-sm hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-accent-foreground/5 group-hover:bg-accent-foreground/10 transition-colors" />
            <div className="relative z-20 w-full transform group-hover:translate-y-[-8px] transition-transform duration-300">
              <Sparkles className="w-8 h-8 text-accent-foreground mb-4" />
              <h3 className="text-2xl font-serif text-white mb-2">Experiencias</h3>
              <p className="text-white/60 text-sm">Eventos y dinámicas exclusivas</p>
            </div>
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-24 pb-24">
        {/* LO NUEVO SECTION */}
        <section id="lo-nuevo" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-serif text-primary flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                Lo Nuevo
              </h2>
              <p className="text-muted-foreground mt-2">Los aportes más recientes de la comunidad.</p>
            </div>
            <Link href="/comunidad/subir">
              <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10">
                <Plus className="w-4 h-4" />
                Abrir Debate
              </Button>
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
              Error cargando los videos: {error.message}
            </div>
          )}

          {videos && videos.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground italic mb-4">Aún no hay contenido en la comunidad.</p>
              <Link href="/comunidad/subir">
                <Button variant="outline">Sé el primero en compartir</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos?.map((video, index) => {
                // Determine layers based on index to mock progress
                const isLocked = index > 3; // First 4 are open, the rest are locked
                return (
                  <VideoCard
                    key={video.id}
                    video={video as Video}
                    likesCount={getLikesCount(video.id)}
                    commentsCount={getCommentsCount(video.id)}
                    isLocked={isLocked}
                  />
                );
              })}
            </div>
          )}
          
          {videos && videos.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Has visto lo más reciente de hoy.</p>
              <Link href="#explorar">
                <Button variant="outline" className="rounded-full px-8">Explorar otra sección</Button>
              </Link>
            </div>
          )}
        </section>

        {/* EXPLORAR SECTION */}
        <section id="explorar" className="scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-primary flex items-center gap-3">
              <Compass className="w-6 h-6 text-primary" />
              Explorar
            </h2>
            <p className="text-muted-foreground mt-2">Sumérgete en el universo de contenido expandido.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted border border-border/50 group">
              <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-2xl font-serif text-white">Debates Filosóficos</h3>
                <p className="text-white/70 mt-2 line-clamp-2">Conversaciones profundas sobre la naturaleza del paganismo moderno.</p>
                <div className="mt-4">
                  <Button size="sm" variant="secondary" className="rounded-full">Entrar a la cápsula</Button>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted border border-border/50 group">
              <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-2xl font-serif text-white">Galería de Arte</h3>
                <p className="text-white/70 mt-2 line-clamp-2">Explora las expresiones artísticas visuales de nuestros miembros.</p>
                <div className="mt-4">
                  <Button size="sm" variant="secondary" className="rounded-full">Entrar a la cápsula</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCIAS SECTION */}
        <section id="experiencias" className="scroll-mt-24 relative p-8 md:p-12 rounded-3xl overflow-hidden border border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-black z-0" />
          <div className="relative z-10">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                Premium
              </span>
              <h2 className="text-3xl font-serif text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Experiencias Exclusivas
              </h2>
              <p className="text-white/70 mt-2 max-w-2xl">
                Eventos presenciales, virtuales y dinámicas inmersivas reservadas para miembros activos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md hover:border-primary/50 transition-colors">
                <CalendarDays className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-serif text-white mb-2">Ritual de Equinoccio</h3>
                <p className="text-sm text-white/50 mb-6">Transmisión en vivo y participación interactiva.</p>
                <Button className="w-full bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30">
                  Próximamente
                </Button>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-xl p-6 backdrop-blur-md hover:border-primary/50 transition-colors">
                <Compass className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-serif text-white mb-2">Mesa Redonda</h3>
                <p className="text-sm text-white/50 mb-6">Charla exclusiva con los organizadores de la fiesta.</p>
                <Button className="w-full bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30">
                  Desbloquear acceso
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
