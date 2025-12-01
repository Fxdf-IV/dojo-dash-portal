import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Shield,
  Heart,
  Users,
  Trophy,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.webp";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { senseisService, locationsService } from "@/services";
import type { Sensei, Location } from "@/types";
import { SEO } from "@/components/SEO";
import { LoadingGrid } from "@/components/LoadingStates";
import { SenseisCarousel } from "@/components/SenseisCarousel";
import HERO_IMAGE from "@/assets/images/hero/HomeCover.webp";

import { dojoConfig } from "@/config/dojo";

const Home = () => {
  const [senseis, setSenseis] = useState<Sensei[]>([]);
  const [loadingSenseis, setLoadingSenseis] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(4);
  const [startIndex, setStartIndex] = useState<number>(0);

  useEffect(() => {
    loadSenseis();
    loadLocations();

    window.scrollTo({ top: 0, behavior: "auto" });
    if (window.location.hash === "#locations") {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    // Recarregar dados quando a página recebe foco (volta do admin)
    const handleFocus = () => {
      loadSenseis();
      loadLocations();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const loadSenseis = async () => {
    try {
      setLoadingSenseis(true);
      const data = await senseisService.getAll();
      setSenseis(data);
    } catch (error) {
      console.error("Erro ao carregar senseis:", error);
      setSenseis([]);
    } finally {
      setLoadingSenseis(false);
    }
  };

  const loadLocations = async () => {
    try {
      setLoadingLocations(true);
      const data = await locationsService.getAll();
      console.log("Home: Loaded locations:", data);
      setLocations(data);
      if (data.length > 0) setSelectedLocation(data[0].id);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  // responsive page size for locations pagination
  useEffect(() => {
    const compute = (w: number) => {
      if (w <= 425) return 1;
      if (w <= 768) return 3;
      if (w <= 1024) return 4;
      return 5;
    };
    const apply = () => setPageSize(compute(window.innerWidth));
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // keep visible window in sync when selection changes
  useEffect(() => {
    if (!selectedLocation) return;
    const idx = locations.findIndex((l) => l.id === selectedLocation);
    if (idx < 0) return;
    if (idx < startIndex) {
      setStartIndex(idx);
    } else if (idx >= startIndex + pageSize) {
      setStartIndex(Math.max(0, idx - pageSize + 1));
    }
  }, [selectedLocation, locations, startIndex, pageSize]);

  // clamp startIndex when pageSize or locations change
  useEffect(() => {
    const maxStart = Math.max(0, locations.length - pageSize);
    if (startIndex > maxStart) setStartIndex(maxStart);
  }, [pageSize, locations, startIndex]);
  const values = [
    {
      icon: Shield,
      title: "Disciplina",
      description: "A base do karatê tradicional e formação de caráter",
    },
    {
      icon: Heart,
      title: "Respeito",
      description: "Honra aos mestres, colegas e à tradição milenar",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Formando cidadãos comprometidos com a sociedade",
    },
    {
      icon: Trophy,
      title: "Excelência",
      description: "Busca contínua pela perfeição técnica e pessoal",
    },
  ];

  const scrollToLocations = () => {
    const section = document.getElementById("locations");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectedIdx = locations.findIndex((l) => l.id === selectedLocation);
  const pageItems = locations.slice(startIndex, startIndex + pageSize);
  const selectedLoc =
    locations.find((l) => l.id === selectedLocation) || locations[0];

  console.log(selectedLoc);
  
  return (
    <>
      <div className="min-h-screen overflow-x-hidden">
        <SEO
          title={`${dojoConfig.name} - Dojo ${dojoConfig.location}`}
          description={dojoConfig.description}
          keywords="karate, kobudo, shorin-ryu, artes marciais, dojo"
        />
        {/* Hero Section */}
        <section
          className="relative h-[100vh] flex items-center justify-center overflow-hidden"
          aria-label="Seção principal"
        >
          <div className="absolute inset-0 bg-gradient-hero" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 bg-fixed"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <img
              src={logo}
              alt={`Logo ${dojoConfig.name}`}
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 animate-fade-in"
              loading="eager"
              width="160"
              height="160"
            />
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
              {dojoConfig.name}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Tradição Shorin-Ryu
            </p>
            <p className="text-lg text-primary-foreground/80 mb-12 max-w-3xl mx-auto">
              Mais que um dojo, uma família dedicada à formação integral através
              do karatê tradicional. Disciplina, respeito e excelência em cada
              treino.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-fit mx-auto">
              <Link to="/contato">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-glow hover:shadow-xl transition-all duration-500 transform hover:scale-105 font-semibold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_2s_ease-in-out_infinite] hover:before:animate-none text-lg px-8 w-full sm:w-auto"
                >
                  Quero Começar
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-white hover:bg-white text-black hover:text-black border-0 shadow-glow hover:shadow-xl transition-all duration-500 transform hover:scale-105 font-semibold text-lg px-8 w-full sm:w-auto"
                onClick={scrollToLocations}
              >
                Conheça Nossos Projetos
              </Button>
            </div>
          </div>
        </section>

        <AnimatedDivider />
        {/* Senseis Section */}
        <section
          className="py-20 bg-gradient-to-br from-background to-secondary/30"
          aria-labelledby="senseis-heading"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Nossos Senseis
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Profissionais dedicados a transmitir a tradição e os valores do
                karatê Shorin-Ryu
              </p>
            </div>

            {loadingSenseis ? (
              <LoadingGrid count={3} />
            ) : (
              <SenseisCarousel senseis={senseis} />
            )}
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 border-t border-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 bg-fixed"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
          <div className="container mx-auto px-4 relative z-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
                Nossos Valores
              </h2>
              <p className="text-primary-foreground text-lg max-w-2xl mx-auto">
                Os pilares que sustentam nossa filosofia e guiam cada aluno em
                sua jornada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="border-primary/20 hover:border-primary transition-all hover:shadow-glow"
                >
                  <CardContent className="p-6 text-center">
                    <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2 text-card-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <AnimatedDivider />

        {/* Locations Section */}
        <section
          id="locations"
          className="py-20 bg-gradient-to-br from-background to-secondary/30 scroll-mt-18"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Nossos Locais de Treino
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Conheça cada um dos espaços onde levamos o karatê tradicional
                para a comunidade
              </p>
            </div>

            {loadingLocations ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando locais...</p>
              </div>
            ) : locations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum local cadastrado.
                </p>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
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

                {/* Selected location card */}
                {selectedLoc && (
                  <div className="animate-fade-in">
                    <Card className="border-primary/20 overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        {selectedLoc.imageUrl ? (
                          <img
                            src={selectedLoc.imageUrl}
                            alt={selectedLoc.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">
                              Imagem do local
                            </p>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="text-2xl font-bold text-card-foreground">
                            {selectedLoc.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {selectedLoc.description ||
                            "Espaço dedicado ao treinamento de karatê tradicional."}
                        </p>
                        {selectedLoc.schedule && selectedLoc.schedule.length > 0 && (
                          <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="font-semibold text-md">Dias e Horários</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {selectedLoc.schedule.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border border-border/50">
                                  <Calendar className="w-4 h-4 text-primary ml-16" />
                                  <span className="font-medium text-left flex-1 ml-2">{item.day}</span>
                                  <Clock className="w-4 h-4 text-primary ml-16" />
                                  <span className="text-muted-foreground flex-1 ml-2">{item.startTime} - {item.endTime}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 bg-fixed"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Pronto para Começar sua Jornada?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Junte-se a nós e descubra o verdadeiro espírito do karatê
              tradicional
            </p>
            <Link to="/contato">
              <Button
                size="lg"
                variant="outline"
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-glow hover:shadow-xl transition-all duration-500 transform hover:scale-105 font-semibold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_2s_ease-in-out_infinite] hover:before:animate-none text-lg px-8 w-full sm:w-auto"
              >
                Entre em Contato
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <AnimatedDivider />
    </>
  );
};
export default Home;
