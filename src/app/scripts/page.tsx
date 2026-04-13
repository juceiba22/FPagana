import { createClient } from '@/lib/supabase/server';
import { ScrollText, LockKeyhole, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ScriptsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware is protecting this route, but just in case:
  if (!user) {
    return null;
  }

  const isValidated = user.email_confirmed_at != null;

  const { data: scripts } = await supabase
    .from('scripts')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="flex-grow container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-border/50">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ScrollText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-serif text-primary mb-2">Archivo de Guiones</h1>
            <p className="text-muted-foreground font-light">
              Bienvenido, {user.email}. Tienes acceso a los textos reservados del ritual.
            </p>
          </div>
        </div>

        {!isValidated && (
          <div className="bg-secondary/10 border border-secondary/50 rounded-md p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none" />
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-serif text-secondary mb-1">Sello Intacto</h3>
                <p className="text-muted-foreground text-sm">
                  Aún no has confirmado tu correo. Verifica tu bandeja de entrada o spam y confirma tu identidad para romper el sello y acceder a todos los escritos protegidos.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts?.map((script) => {
            const isAccessible = script.access_level === 'public' || isValidated;
            
            return (
              <Card key={script.id} className="border-border/50 bg-card/30 hover:bg-card/60 transition-colors flex flex-col justify-between h-auto min-h-[14rem] group backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${isAccessible ? 'text-primary' : 'text-secondary'}`}>
                      {isAccessible ? 'Disponible' : 'Bajo Sello'}
                    </span>
                    {!isAccessible ? (
                      <LockKeyhole className="w-4 h-4 text-secondary opacity-70" />
                    ) : (
                      <ScrollText className="w-4 h-4 text-primary opacity-70" />
                    )}
                  </div>
                  <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors leading-tight">
                    {script.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {script.duration_text && (
                    <p className="mt-2 text-xs text-muted-foreground/80 font-mono">Duración aprox: {script.duration_text}</p>
                  )}
                </CardContent>
                <CardFooter>
                  {isAccessible ? (
                    <Link href={script.content_url || '#'} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]">
                        Leer Manuscrito
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full bg-secondary hover:bg-secondary border-none text-secondary-foreground opacity-50 cursor-not-allowed">
                      Completar rito anterior
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
