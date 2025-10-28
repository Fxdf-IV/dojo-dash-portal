import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import ctMaylson1 from "@/assets/gallery/ct-maylson-1.jpg";
import ctMaylson2 from "@/assets/gallery/ct-maylson-2.jpg";
import ctMaylson3 from "@/assets/gallery/ct-maylson-3.jpg";
import bolaCidadania1 from "@/assets/gallery/bola-cidadania-1.jpg";
import bolaCidadania2 from "@/assets/gallery/bola-cidadania-2.jpg";
import bolaCidadania3 from "@/assets/gallery/bola-cidadania-3.jpg";
import gotaVerde1 from "@/assets/gallery/gota-verde-1.jpg";
import gotaVerde2 from "@/assets/gallery/gota-verde-2.jpg";
import gotaVerde3 from "@/assets/gallery/gota-verde-3.jpg";
import colegioExpoente1 from "@/assets/gallery/colegio-expoente-1.jpg";
import colegioExpoente2 from "@/assets/gallery/colegio-expoente-2.jpg";
import colegioExpoente3 from "@/assets/gallery/colegio-expoente-3.jpg";

const Fotos = () => {
  const locations = [
    {
      name: "CT Maylson Campos",
      description: "Centro de treinamento principal com infraestrutura completa para formação técnica e espiritual. Equipado com tatames profissionais, ambiente climatizado e espaço dedicado ao estudo da tradição Shorin-Ryu.",
      images: [ctMaylson1, ctMaylson2, ctMaylson3],
    },
    {
      name: "Bola e Cidadania",
      description: "Projeto social que transforma vidas através do karatê. Atendemos comunidades carentes levando valores como disciplina, respeito e cidadania. Mais que técnicas marciais, formamos cidadãos conscientes e comprometidos.",
      images: [bolaCidadania1, bolaCidadania2, bolaCidadania3],
    },
    {
      name: "Projeto Gota Verde",
      description: "Iniciativa que une karatê tradicional e consciência ambiental. Praticamos em harmonia com a natureza, realizando treinos ao ar livre e atividades de preservação. O respeito do dojo se estende ao planeta.",
      images: [gotaVerde1, gotaVerde2, gotaVerde3],
    },
    {
      name: "Colégio Expoente",
      description: "Parceria educacional que integra o karatê ao ambiente escolar. Os alunos desenvolvem disciplina, concentração e autocontrole que refletem no desempenho acadêmico. Uma formação que une corpo, mente e conhecimento.",
      images: [colegioExpoente1, colegioExpoente2, colegioExpoente3],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Galeria de Fotos
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Conheça nossos espaços de treinamento e veja o karatê tradicional em ação
          </p>
        </div>
      </section>

      {/* Gallery Sections */}
      {locations.map((location, locationIndex) => (
        <section 
          key={locationIndex} 
          className={`py-20 ${locationIndex % 2 === 0 ? 'bg-gradient-to-br from-background to-secondary/30' : 'bg-gradient-to-br from-background'}`}
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
              {location.images.map((image, imageIndex) => (
                <Card 
                  key={imageIndex} 
                  className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden group"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image}
                        alt={`${location.name} - Foto ${imageIndex + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Fotos;
