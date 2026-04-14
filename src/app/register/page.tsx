"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          username,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden relative">
        {isSubmitted ? (
          <>
            <div className="absolute inset-0 bg-secondary/5 pointer-events-none" />
            <CardHeader className="text-center pt-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 shadow-[0_0_15px_-3px_rgba(128,0,32,0.4)]">
                <UserPlus className="w-8 h-8" />
              </div>
              <CardTitle className="text-3xl font-serif text-secondary">Pacto Iniciado</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-10">
              <p className="text-muted-foreground font-light text-lg">
                Hemos enviado un sello a tu correo. Debes validarlo para romper el primer candado y acceder a los manuscritos.
              </p>
            </CardContent>
            <CardFooter className="justify-center pb-8">
              <Link href="/login">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary">
                  Volver a la puerta
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 border border-secondary/20">
                <UserPlus className="w-6 h-6" />
              </div>
              <CardTitle className="text-3xl font-serif text-primary">Iniciación</CardTitle>
              <CardDescription className="text-muted-foreground font-light mt-2">Peticiona tu entrada. No todos son aceptados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="text-destructive text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</div>}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-muted-foreground">Nombre de Iniciado</label>
                <input 
                  id="username" 
                  type="text" 
                  placeholder="Adalid" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-background/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Sello Primordial (Correo)</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="iniciado@ejemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-background/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Palabra de Paso</label>
                <input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-background/50 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6">
              <Button 
                onClick={handleRegister} 
                disabled={isLoading}
                className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-md shadow-[0_0_15px_-3px_rgba(128,0,32,0.4)]"
              >
                {isLoading ? "Sellando Pacto..." : "Sellar Pacto"}
              </Button>
              <div className="text-sm text-center text-muted-foreground font-light">
                ¿Ya eres parte?{' '}
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                  Abrir las puertas
                </Link>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
