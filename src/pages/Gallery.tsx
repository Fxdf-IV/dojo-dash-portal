import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  MapPin,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { locationsService } from "@/services";
import type { Location } from "@/types";
import { SEO } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingStates";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import HERO_IMAGE from "@/assets/images/hero/GalleryCover.jpg";

const Gallery = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const [pageSize, setPageSize] = useState<number>(4); // responsive number of visible items
  const [startIndex, setStartIndex] = useState<number>(0); // window start for visible items
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<{
    imageUrl: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  // responsive page size based on viewport width
  useEffect(() => {
    const compute = (w: number) => {
      if (w <= 425) return 1;
      if (w <= 768) return 3;
      if (w <= 1024) return 4;
      return 5;
    };

    const apply = () => {
      try {
        const w = window.innerWidth;
        setPageSize(compute(w));
      } catch (e) {
        // ignore (SSR)
      }
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // keep visible window in sync when selection changes
  useEffect(() => {
    if (!selectedLocation) return;
    const idx = locations.findIndex((l) => l.id === selectedLocation);
    if (idx < 0) return;
    // if selected is before window, shift window left
    if (idx < startIndex) {
      setStartIndex(idx);
    } else if (idx >= startIndex + pageSize) {
      // if selected is after window, shift window right so selected is last
      setStartIndex(Math.max(0, idx - pageSize + 1));
    }
  }, [selectedLocation, locations, startIndex, pageSize]);

  // clamp startIndex when pageSize or locations change
  useEffect(() => {
    const maxStart = Math.max(0, locations.length - pageSize);
    if (startIndex > maxStart) setStartIndex(maxStart);
  }, [pageSize, locations, startIndex]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await locationsService.getAll();
      setLocations(data);
      if (data.length > 0) {
        setSelectedLocation(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedIdx = locations.findIndex((l) => l.id === selectedLocation);
  const pageItems = locations.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen pt-20">
      <SEO
        title="Galeria - Alessandro Karatê e Kobudo"
        description="Confira fotos dos nossos dojos e espaços de treinamento. Veja o karatê tradicional Shorin-Ryu em ação em Palmital e região."
        keywords="galeria karate, fotos dojo, locais treino karate palmital, academia karate"
      />

      {/* Hero Section */}
      <section
        className="relative py-20 bg-gradient-hero"
        aria-labelledby="gallery-hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-[center_bottom_-25%] opacity-20 bg-fixed"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1
            id="gallery-hero"
            className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6"
          >
            Galeria de Fotos
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Veja fotos dos nossos dojos, eventos e momentos de treino. Selecione
            um local para visualizar as imagens correspondentes.
          </p>
        </div>
      </section>
      <AnimatedDivider />

      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full flex justify-center mb-6">
                <div className="max-w-full px-2">
                  <Pagination className="p-1 bg-background/50 backdrop-blur-sm border shadow-sm hover:bg-background/50 rounded-lg">
                    <div className="overflow-x-auto no-scrollbar">
                      <PaginationContent className="flex items-center gap-2">
                        <PaginationItem className="flex-none">
                          <PaginationLink
                            href="#"
                            size="default"
                            className="p-2 text-foreground hover:text-primary hover:bg-background/10"
                            onClick={(e) => {
                              e.preventDefault();
                              // move selection one to the left
                              const idx = Math.max(0, selectedIdx - 1);
                              const loc = locations[idx];
                              if (loc) setSelectedLocation(loc.id);
                            }}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </PaginationLink>
                        </PaginationItem>

                        {pageItems.map((location) => (
                          <PaginationItem
                            key={location.id}
                            className="flex-1 w-[200px]"
                          >
                            <PaginationLink
                              href="#"
                              size="default"
                              className="w-full text-center truncate text-sm hover:bg-white hover:text-foreground"
                              isActive={selectedLocation === location.id}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedLocation(location.id);
                              }}
                            >
                              {location.name}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem className="flex-none">
                          <PaginationLink
                            href="#"
                            size="default"
                            className="p-2 text-foreground hover:text-primary hover:bg-background/10"
                            onClick={(e) => {
                              e.preventDefault();
                              // move selection one to the right
                              const idx = Math.min(
                                locations.length - 1,
                                selectedIdx + 1
                              );
                              const loc = locations[idx];
                              if (loc) setSelectedLocation(loc.id);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </PaginationLink>
                        </PaginationItem>
                      </PaginationContent>
                    </div>
                  </Pagination>
                </div>
              </div>

              {/* Selected location content */}
              {(() => {
                const location =
                  locations.find((l) => l.id === selectedLocation) ||
                  locations[0];
                if (!location) return null;
                return (
                  <div className="mt-0 animate-fade-in">
                    {/* Location Header */}
                    <div className="text-center mb-12 animate-fade-in">
                      <div className="py-6 flex items-center justify-center align-items-center gap-3 mb-4">
                        <MapPin className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                          {location.name}
                        </h2>
                      </div>
                      {location.description && (
                        <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                          {location.description}
                        </p>
                      )}
                    </div>

                    {/* Photo Grid */}
                    {location.images && location.images.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {location.images.map((image, imageIndex) => (
                          <Card
                            key={imageIndex}
                            className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden group cursor-pointer animate-scale-in"
                            onClick={() => {
                              setModalImage({
                                imageUrl: image.imageUrl,
                                caption: image.caption,
                              });
                              setModalOpen(true);
                            }}
                            style={{ animationDelay: `${imageIndex * 0.05}s` }}
                          >
                            <CardContent className="p-0">
                              <div className="aspect-[4/3] overflow-hidden relative">
                                <img
                                  src={image.imageUrl}
                                  alt={
                                    image.caption ||
                                    `Foto ${imageIndex + 1} do local ${
                                      location.name
                                    }`
                                  }
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                  width="400"
                                  height="300"
                                />
                                {image.caption && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <p className="text-white text-sm font-medium">
                                      {image.caption}
                                    </p>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ImageIcon className="w-12 h-12 text-white drop-shadow-lg" />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Nenhuma foto disponível para este local ainda.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>
      {modalImage && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="p-0 border-none bg-black/80 max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/80">
              <div className="w-full flex-1 flex items-center justify-center p-4 bg-black/80 rounded-sm">
                <img
                  src={modalImage.imageUrl}
                  alt={modalImage.caption || "Imagem da galeria"}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              </div>
              {modalImage.caption && (
                <div className="w-full text-center mt-2 mb-4 text-sm text-muted-foreground">
                  {modalImage.caption}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      <AnimatedDivider />
    </div>
  );
};

export default Gallery;
