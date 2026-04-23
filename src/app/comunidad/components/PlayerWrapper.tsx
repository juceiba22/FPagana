"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function PlayerWrapper({ url, thumbnail, mediaType }: {
  url: string;
  thumbnail?: string | null;
  mediaType?: string | null;
}) {
  const [ReactPlayer, setReactPlayer] = useState<any>(null);

  useEffect(() => {
    if (mediaType !== "image") {
      import("react-player").then((mod) => {
        setReactPlayer(() => mod.default);
      });
    }
  }, [mediaType]);

  if (mediaType === "image") {
    return (
      <div className="relative bg-black rounded-xl overflow-hidden border border-border/50 flex items-center justify-center min-h-[300px]">
        <img
          src={url}
          alt="Imagen de la comunidad"
          className="max-w-full max-h-[600px] object-contain"
        />
      </div>
    );
  }

  if (!ReactPlayer) {
    return (
      <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden border border-border/50">
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-muted-foreground">
          Cargando reproductor...
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden border border-border/50">
      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          playing={false}
        />
      </div>
    </div>
  );
}