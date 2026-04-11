import { createClient } from '@/lib/supabase/server';
import { ScrollText, LockKeyhole } from 'lucide-react';

export default async function ScriptsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware is protecting this route, but just in case:
  if (!user) {
    return null;
  }

  // Future: Fetch scripts from database
  // const { data: scripts } = await supabase.from('scripts').select('*');

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Script Items based on actual acts */}
          {[
            { id: 1, title: 'ACTO 1: La verdad y la libertad', status: 'Disponible', time: '7 min' },
            { id: 2, title: 'ACTO 2: El demonio en el mundo criollo', status: 'Bajo Sello', time: '3 min' },
            { id: 3, title: 'ACTO 3: La libertad y José Mercado', status: 'Bajo Sello', time: '10 min' },
            { id: 4, title: 'ACTO 4: ¿De qué nos quieren hacer olvidar?', status: 'Bajo Sello', time: '4 min' },
            { id: 5, title: 'ACTO 5: La comparsa de los incas', status: 'Bajo Sello', time: '15 min' },
            { id: 6, title: 'ACTO 6: El Secreto de la civilización', status: 'Bajo Sello', time: '8 min' },
            { id: 7, title: 'ACTO 7: Ninio Ancestral', status: 'Bajo Sello', time: '30 min' },
            { id: 8, title: 'ACTOS 8-12: El folklore furioso y la Fiesta Pagana', status: 'Bajo Sello', time: '20 min+' },
          ].map((script) => (
            <div key={script.id} className="p-6 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors flex flex-col justify-between h-56 group">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest ${script.status === 'Disponible' ? 'text-primary' : 'text-secondary'}`}>
                    {script.status}
                  </span>
                  {script.status === 'Bajo Sello' && (
                    <LockKeyhole className="w-4 h-4 text-secondary opacity-70" />
                  )}
                </div>
                <h3 className="text-xl font-serif group-hover:text-primary transition-colors leading-tight">
                  {script.title}
                </h3>
                  <p className="mt-2 text-xs text-muted-foreground/80 font-mono">Duración aprox: {script.time}</p>
              </div>
              <button disabled={script.status === 'Bajo Sello'} className="text-sm text-left text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors flex items-center gap-2 mt-4">
                {script.status === 'Disponible' ? 'Leer Manuscrito →' : 'Completar rito anterior'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
