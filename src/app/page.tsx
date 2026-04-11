import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight, Sparkles, ScrollText, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex-grow flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full relative px-4 py-32 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background z-0" />

          <div className="z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-4 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Experimenta el Ritual</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-bold font-serif tracking-tighter drop-shadow-lg">
              La Fiesta Pagana
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground font-light px-4 max-w-2xl mx-auto">
              Un ritual inmersivo que devela una verdad. Adéntrate en las sombras y descubre lo que yace detrás del telón de la realidad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-md h-12 w-full sm:w-auto">
                Descubrir la Verdad
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-md h-12 border-border hover:bg-secondary/10 hover:text-secondary w-full sm:w-auto" asChild>
                <Link href="#personajes">Quiero saber más</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Characters Section */}
        <section id="personajes" className="w-full px-4 py-32 bg-card/30 border-y border-border">
          <div className="container mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-primary">El Ritual</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                Hazte de plata, espeja el oro de las alturas y verdaderamente serás un argentino.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: "Ninio Monje", role: "El Buscador de Verdad", desc: "Aún con la capucha gacha. Nos advierte que en el siglo XXI hemos pasado de la era del tiempo a la del espacio tiempo, y que la materia en verdad, no existe.", icon: "🌫️" },
                { name: "Gabriel", role: "El Niño Trágico", desc: "Vestido a lo años 30. Liberó a un demonio accidentalmente digitando el código '616' en la tarjeta de crédito de sus padres para comprar una espada en su videojuego.", icon: "🕹️" },
                { name: "Mamá & Las Purificadoras", role: "Contención Terrenal", desc: "La madre lo baja a la tierra, mientras que junto a la chola y la bruja sahúman incesantemente el ambiente en cada etapa del show para ahuyentar energías.", icon: "🌿" },
                { name: "José Mercado", role: "El Señor de la Biyuya", desc: "Ostentoso, decide a quién le entra el billetín. Impide la libertad absoluta de los demás porque a él y a su primo 'Raúl Estado' les conviene que trabajen para ellos.", icon: "💵" },
                { name: "El Mojigato", role: "Cooptado Tecnológico", desc: "Un esclavo moderno cargando un celular gigante, incapaz de interactuar con el mundo real, reflejo de la empresa civilizatoria que nos vuelve robots.", icon: "📱" },
                { name: "Materio Primo & Gugú", role: "El Frenesí Final", desc: "Gugú Petite Morte trae la sensualidad a Flor de Piel y Materio Primo un folklore furioso. Ellos dan lugar a que comience la verdadera y apoteósica Fiesta Pagana.", icon: "🎭" }
              ].map((char, i) => (
                <Card key={i} className="group hover:-translate-y-2 transition-all duration-300 bg-background/50 border-border/50 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.2)] hover:border-primary/50 flex flex-col">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                      {char.icon}
                    </div>
                    <CardTitle className="text-2xl font-serif tracking-wide group-hover:text-primary transition-colors">{char.name}</CardTitle>
                    <CardDescription className="uppercase tracking-widest text-xs text-secondary font-bold">{char.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">{char.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Scripts Teaser Section */}
        <section className="w-full px-4 py-32 relative overflow-hidden bg-background">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--color-secondary) 0%, transparent 60%)" }} />

          <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-background border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center text-primary mb-8">
              <ScrollText className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-primary">Textos Sagrados</h2>
            <p className="text-xl text-muted-foreground font-light">
              Los pergaminos de La Fiesta Pagana se encuentran protegidos. Son de conocimiento exclusivo para los espect-actores de esta experiencia.
            </p>

            <div className="mt-16 p-8 md:p-12 border border-border/50 rounded-2xl bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden text-left group">
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent z-10 pointer-events-none" />

              <div className="font-serif opacity-40 select-none space-y-6 text-lg relative z-0">
                <p className="tracking-widest text-primary uppercase text-sm">PRIMER ACTO - LA VERDAD Y LA LIBERTAD</p>
                <p className="italic text-muted-foreground">(Un anuncio misterioso. Ninio aún no se muestra, permanece con la capucha baja.)</p>
                <p className="leading-relaxed"><strong className="font-bold">NINIO MONJE:</strong> A la búsqueda de la verdad. Asistimos hace algún tiempo todos. Nadie se había dado cuenta aún, pero en el siglo XXI pasamos de la era del tiempo a la era del espacio tiempo...</p>
                <p className="italic text-muted-foreground">(De repente la música se corta e ingresa Gabriel a toda velocidad...)</p>
                <p className="leading-relaxed"><strong className="font-bold">GABRIEL:</strong> Yo soy el niño que liberó al demonio. No quise hacerlo. Fue lo que se dice un accidente. Estaba yo con mi videojuego... logré tomar la tarjeta de mis padres y di con la cifra diabólica: 616...</p>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 pt-16 z-20 flex flex-col items-center">
                <Button size="lg" className="rounded-full h-14 px-8 shadow-[0_0_40px_-5px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform" asChild>
                  <Link href="/register">
                    Solicitar Acceso <MoveRight className="ml-3 w-5 h-5" />
                  </Link>
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">Requiere membresía en la comunidad</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
