import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-serif text-primary">Ingresar al Círculo</CardTitle>
          <CardDescription className="text-muted-foreground font-light mt-2">Revela tu identidad a la logia para acceder a los secretos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Note: This is a placeholder form. Actual Supabase Auth action to be added later. */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
            <input id="email" type="email" placeholder="iniciado@ejemplo.com" className="w-full p-3 bg-background/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Palabra Sagrada (Contraseña)</label>
            <input id="password" type="password" placeholder="••••••••" className="w-full p-3 bg-background/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6">
          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-md shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]">
            Acceder al Gremio
          </Button>
          <div className="text-sm text-center text-muted-foreground font-light">
            ¿Aún no has sido iniciado?{' '}
            <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
              Solicitar Bautismo
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
