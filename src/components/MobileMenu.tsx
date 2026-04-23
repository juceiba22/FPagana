"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={toggleMenu} className="text-primary hover:bg-primary/10">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-md border-b border-border p-4 flex flex-col space-y-4 shadow-lg z-50">
          <Link href="/#personajes" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-border/50">
            Personajes
          </Link>
          <Link href="/scripts" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-border/50">
            Guiones
          </Link>
          <Link href="/comunidad" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-border/50">
            Comunidad
          </Link>
          {user && (
            <Link href="/staff/chat" onClick={closeMenu} className="text-lg font-medium hover:text-primary transition-colors py-2 border-b border-border/50">
              Chat
            </Link>
          )}
          {user ? (
            <form action="/auth/signout" method="post" className="pt-2">
              <Button variant="outline" type="submit" className="w-full border-border hover:bg-secondary/20 hover:text-secondary justify-center">
                Cerrar Sesión
              </Button>
            </form>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Button variant="ghost" asChild className="w-full hover:text-primary hover:bg-primary/10 justify-center">
                <Link href="/login" onClick={closeMenu}>Ingresar</Link>
              </Button>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-center">
                <Link href="/register" onClick={closeMenu}>Unirse</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
