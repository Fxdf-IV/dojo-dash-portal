import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { locationsService } from "@/services";
import type { Location } from "@/types";

const Gallery = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await locationsService.getAll();
      setLocations(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Galeria de Fotos
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Conheça nossos espaços de treinamento e veja o karatê tradicional em ação
          </p>
        </div>
      </section>

      {/* Gallery Sections */}
      {loading ? (
        <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Carregando locais...</p>
          </div>
        </section>
      ) : locations.length === 0 ? (
        <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Nenhum local disponível no momento.</p>
          </div>
        </section>
      ) : (
        locations.map((location, locationIndex) => (
          <section
            key={location.id}
            className={`py-20 bg-gradient-to-br from-background to-secondary/30`}
          >
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                    {location.name}
                  </h2>
                </div>
                <p className="text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
                  {location.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {location.images && location.images.length > 0 ? (
                  location.images.map((image, imageIndex) => (
                    <Card
                      key={imageIndex}
                      className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden group cursor-pointer"
                      onClick={() => window.open(image.imageUrl, '_blank')}
                    >
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img
                            src={image.imageUrl}
                            alt={image.caption || `Foto ${imageIndex + 1} - ${location.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <p className="text-white text-sm">{image.caption}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">Nenhuma foto disponível para este local.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Gallery;
