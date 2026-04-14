import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Eye } from "lucide-react";
import Link from "next/link";

export default function TipoDeAccesoPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-primary drop-shadow-lg">Elige tu Senda</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Las puertas del ritual están abiertas, pero cada iniciado debe caminar por su propio sendero. ¿Cuál es tu rol en esta vigilia?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opción A: Staff */}
          <Link href="/login" className="block group h-full">
            <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
              <CardHeader className="pt-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 shadow-[0_0_15px_-3px_rgba(128,0,32,0.4)] group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-serif tracking-wide text-foreground group-hover:text-secondary transition-colors">Staff y Artistas</CardTitle>
                <CardDescription className="text-muted-foreground font-light mt-2">Músicos, actores y miembros del culto.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-light text-muted-foreground/80 leading-relaxed">
                  Cruza aquí si has sellado tú mismo las palabras del ritual y posees una llave directa para ensayar nuestra vigilia.
                </p>
              </CardContent>
              <CardFooter className="pb-8 justify-center">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/20 hover:text-secondary">
                  Autentificarse
                </Button>
              </CardFooter>
            </Card>
          </Link>

          {/* Opción B: Espect-actor */}
          <Link href="/experiencia-espectador" className="block group h-full">
            <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <CardHeader className="pt-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-serif tracking-wide text-foreground group-hover:text-primary transition-colors">Espect-actor</CardTitle>
                <CardDescription className="text-muted-foreground font-light mt-2">Acompañantes en la función del espectáculo.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm font-light text-muted-foreground/80 leading-relaxed">
                  Cruza aquí si buscas asomarte a las sombras y leer la primera línea del destino antes de presentarte físicamente.
                </p>
              </CardContent>
              <CardFooter className="pb-8 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]">
                  Iniciar Experiencia
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
