import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollText, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function ExperienciaEspectadorPage() {
  const supabase = await createClient();

  const { data: scripts, error } = await supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching scripts:', error);
  }

  const scriptsList = scripts || [];

  return (
    <div className="flex-grow container mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-primary drop-shadow-lg">El Velo del Público</h1>
          <p className="text-xl text-muted-foreground font-light px-4 max-w-2xl mx-auto">
            Bienvenido, espect-actor. Parte del conocimiento profano te será otorgado aquí. Para descubrir el resto, deberás manifestarte durante el Ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scriptsList.map((script) => {
            const isAccessible = script.access_level === 'public' || script.title.toUpperCase().includes('ACTO 1:');

            return (
              <Card 
                key={script.id} 
                className={`bg-card/40 backdrop-blur-sm border-border/50 relative overflow-hidden transition-all duration-300 ${isAccessible ? 'hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)] hover:border-primary/50' : 'opacity-80'}`}
              >
                {!isAccessible && (
                  <div className="absolute inset-0 bg-secondary/5 pointer-events-none z-0" />
                )}
                
                <CardHeader className="relative z-10 pb-4 border-b border-border/30">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md flex-shrink-0 ${isAccessible ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                        {isAccessible ? <ScrollText className="w-5 h-5" /> : <LockKeyhole className="w-5 h-5" />}
                      </div>
                      <div>
                        <CardTitle className={`font-serif text-xl ${isAccessible ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {script.title}
                        </CardTitle>
                        <CardDescription className="uppercase tracking-widest text-xs mt-1 font-semibold text-muted-foreground">
                          {isAccessible ? 'Revelado' : 'Sellado'}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10 pt-6">
                  <div className="flex justify-between text-sm text-muted-foreground font-light">
                    <span>Duración estimada</span>
                    <span className="font-medium text-foreground">{script.duration_text || 'Desconocido'}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="relative z-10">
                  {isAccessible ? (
                    <Link href={`/experiencia-espectador/${script.id}`} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]">
                        Leer Manuscrito
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full bg-secondary/80 hover:bg-secondary/80 border-none text-secondary-foreground opacity-60 cursor-not-allowed">
                      Reservado para el Ritual
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
