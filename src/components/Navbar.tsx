import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-widest text-primary">
          PAGANOS
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/#personajes" className="text-sm font-medium hover:text-primary transition-colors">
            Personajes
          </Link>
          <Link href="/scripts" className="text-sm font-medium hover:text-primary transition-colors">
            Guiones
          </Link>
          <Link href="/comunidad" className="text-sm font-medium hover:text-primary transition-colors">
            Comunidad
          </Link>
          {user && (
            <Link href="/staff/chat" className="text-sm font-medium hover:text-primary transition-colors">
              Chat
            </Link>
          )}
          {user ? (
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit" className="border-border hover:bg-secondary/20 hover:text-secondary">
                Cerrar Sesión
              </Button>
            </form>
          ) : (
            <div className="space-x-4">
              <Button variant="ghost" size="sm" asChild className="hover:text-primary hover:bg-primary/10">
                <Link href="/login">Ingresar</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/register">Unirse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

