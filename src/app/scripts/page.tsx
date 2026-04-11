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
              Bienvenido, {user.email}. Tienes acceso a los textos reservados de la logia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dummy Script Items */}
          {[
            { id: 1, title: 'ACTO I: El Llamado en la Oscuridad', status: 'Disponible' },
            { id: 2, title: 'ACTO II: La Herejía del Sol', status: 'Disponible' },
            { id: 3, title: 'ACTO III: Sacrificio y Renacimiento', status: 'Bajo Sello' },
            { id: 4, title: 'Epílogo Oculto', status: 'Bajo Sello' }
          ].map((script) => (
            <div key={script.id} className="p-6 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-colors flex flex-col justify-between h-48 group">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-bold uppercase tracking-widest ${script.status === 'Disponible' ? 'text-primary' : 'text-secondary'}`}>
                    {script.status}
                  </span>
                  {script.status === 'Bajo Sello' && (
                    <LockKeyhole className="w-4 h-4 text-secondary opacity-70" />
                  )}
                </div>
                <h3 className="text-xl font-serif group-hover:text-primary transition-colors">
                  {script.title}
                </h3>
              </div>
              <button disabled={script.status === 'Bajo Sello'} className="text-sm text-left text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors flex items-center gap-2">
                {script.status === 'Disponible' ? 'Leer Manuscrito →' : 'Completar rito anterior para revelar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
