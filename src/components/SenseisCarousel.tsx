import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Sensei } from "@/types";
import { cn } from "@/lib/utils";
import { BELT_GRADES } from "@/components/BeltSelect";

interface SenseisCarouselProps {
  senseis: Sensei[];
}

export function SenseisCarousel({ senseis }: SenseisCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Duplicate items if there are few (2 or 3) to ensure smooth looping on desktop
  // Embla Carousel needs enough slides to cover the viewport to loop correctly
  const displaySenseis = React.useMemo(() => {
    if (!senseis || senseis.length === 0) return [];
    if (senseis.length === 1) return senseis;
    
    // If we have 2 or 3 items, duplicate them to ensure we have enough for looping
    // 2 items -> 3 copies = 6 items
    // 3 items -> 2 copies = 6 items
    // 4+ items -> enough for desktop (3 per view)
    if (senseis.length === 2) return [...senseis, ...senseis, ...senseis];
    if (senseis.length === 3) return [...senseis, ...senseis];
    return senseis;
  }, [senseis]);

  if (!senseis || senseis.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum profissional cadastrado"
        description="Os perfis da sua equipe aparecerão aqui assim que forem adicionados."
        className="mx-auto max-w-2xl"
      />
    );
  }

  return (
    <Carousel
      opts={{
        align: "center",
        loop: senseis.length > 1,
        containScroll: false,
      }}
      setApi={setApi}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent className="-ml-4 py-8">
        {displaySenseis.map((sensei, index) => (
          <CarouselItem key={`${sensei.id}-${index}`} className="pl-4 md:basis-1/3 basis-3/4">
            <div
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "transition-all duration-500 ease-in-out transform cursor-pointer",
                index === current
                  ? "scale-110 opacity-100 z-10 shadow-2xl ring-2 ring-primary/20 rounded-xl h-full"
                  : "scale-90 opacity-60 blur-[1px] grayscale h-full"
              )}
            >
              <Card className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden group h-full bg-card">
                <div className="aspect-square overflow-hidden bg-muted/50 flex items-center justify-center">
                  {sensei.imageUrl ? (
                    <img
                      src={sensei.imageUrl}
                      alt={`Foto de ${sensei.name} - ${sensei.rank}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-muted-foreground">Foto do Sensei</div>
                  )}
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-1 text-card-foreground group-hover:text-primary transition-colors">
                    {sensei.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4 text-sm">
                    {BELT_GRADES.find((belt) => belt.id === sensei.rank)?.name ||
                      sensei.rank}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {sensei.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-12" />
      <CarouselNext className="hidden md:flex -right-12" />
    </Carousel>
  );
}
