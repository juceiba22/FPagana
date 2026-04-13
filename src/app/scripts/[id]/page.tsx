import { createClient } from '@/lib/supabase/server';
import { LockKeyhole, ArrowLeft, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ScriptDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; 
  }

  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  const { data: script, error } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !script) {
    return (
      <div className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-destructive">Manuscrito extraviado</h2>
          <Link href="/scripts" className="mt-4 inline-block">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver al archivo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isValidated = user.email_confirmed_at != null;
  const isAccessible = script.access_level === 'public' || isValidated;

  if (!isAccessible) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 py-24">
        <div className="max-w-md w-full bg-card/50 backdrop-blur-sm border-border/50 rounded-xl p-8 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5 pointer-events-none" />
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6 shadow-[0_0_15px_-3px_rgba(128,0,32,0.4)]">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-secondary mb-4">Contenido Bloqueado</h1>
          <p className="text-muted-foreground font-light mb-8">
            El sello de este manuscrito aún no ha sido roto. Debes verificar tu identidad en el plano mundano (confirmar tu email) antes de poder acceder a estos conocimientos.
          </p>
          <Link href="/scripts" className="w-full">
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground space-x-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver Atrás
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed font-serif text-foreground/90 whitespace-pre-wrap">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="flex-grow container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/scripts">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary gap-2 pl-0">
              <ArrowLeft className="w-4 h-4" /> Cerrar Manuscrito
            </Button>
          </Link>
        </div>

        <div className="bg-card/40 backdrop-blur-md border border-primary/30 rounded-lg p-8 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-primary/20">
            <ScrollText className="w-8 h-8 text-primary" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/70 block mb-1">Textos Sagrados</span>
              <h1 className="text-3xl lg:text-4xl font-serif text-primary">{script.title}</h1>
            </div>
          </div>

          <div className="article-content">
            {script.content_body ? (
              formatText(script.content_body)
            ) : (
              <p className="text-muted-foreground font-light text-center italic py-20">Este pergamino aún se encuentra en blanco...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
