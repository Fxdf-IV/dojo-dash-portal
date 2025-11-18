import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Heart, Users, Trophy, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { senseisService, locationsService } from "@/services";
import type { Sensei, Location } from "@/types";
import { BELT_GRADES } from "@/components/BeltSelect";
import { SEO } from "@/components/SEO";
import { LoadingGrid, LoadingSpinner } from "@/components/LoadingStates";
const Home = () => {
  const [senseis, setSenseis] = useState<Sensei[]>([]);
  const [loadingSenseis, setLoadingSenseis] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    loadSenseis();
    loadLocations();

    window.scrollTo({ top: 0, behavior: "auto" });
    if (window.location.hash === "#locations") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    // Recarregar dados quando a página recebe foco (volta do admin)
    const handleFocus = () => {
      loadSenseis();
      loadLocations();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadSenseis = async () => {
    try {
      setLoadingSenseis(true);
      const data = await senseisService.getAll();
      setSenseis(data);
    } catch (error) {
      console.error('Erro ao carregar senseis:', error);
      setSenseis([]);
    } finally {
      setLoadingSenseis(false);
    }
  };

  const loadLocations = async () => {
    try {
      setLoadingLocations(true);
      const data = await locationsService.getAll();
      setLocations(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
      setLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };
  const values = [{
    icon: Shield,
    title: "Disciplina",
    description: "A base do karatê tradicional e formação de caráter"
  }, {
    icon: Heart,
    title: "Respeito",
    description: "Honra aos mestres, colegas e à tradição milenar"
  }, {
    icon: Users,
    title: "Comunidade",
    description: "Formando cidadãos comprometidos com a sociedade"
  }, {
    icon: Trophy,
    title: "Excelência",
    description: "Busca contínua pela perfeição técnica e pessoal"
  }];

  const scrollToLocations = () => {
    const section = document.getElementById("locations");
    section?.scrollIntoView({ behavior: "smooth", block: "start"});
  };

  return <div className="min-h-screen">
      <SEO
        title="Alessandro Karatê e Kobudo - Dojo Palmital SP"
        description="Escola de Karatê Shorin-Ryu e Kobudo em Palmital SP. Tradição, disciplina e respeito. Formando não apenas karatecas, mas cidadãos de caráter."
        keywords="karate palmital, kobudo palmital, shorin-ryu, artes marciais palmital, dojo alessandro, karatê tradicional"
      />
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden" aria-label="Seção principal">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070')] bg-cover bg-center opacity-20" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <img 
            src={logo} 
            alt="Logo Alessandro Karatê e Kobudo - Dojo Palmital SP" 
            className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 animate-fade-in"
            loading="eager"
            width="160"
            height="160"
          />
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Alessandro Karatê e Kobudo
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">Tradição Shorin-Ryu</p>
          <p className="text-lg text-primary-foreground/80 mb-12 max-w-3xl mx-auto">
            Mais que um dojo, uma família dedicada à formação integral através do karatê tradicional.
            Disciplina, respeito e excelência em cada treino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="shadow-glow text-lg px-8">
                Quero Começar
              </Button>
          </Link>
            {/* TODO: Add smooth scroll transition to locations */}
            <Button size="lg" variant="outline" className="shadow-glow text-lg px-8"
              onClick={scrollToLocations}>
                Conheça Nossos Projetos
              </Button>
          </div>
        </div>
      </section>

      {/* Senseis Section */}
      <section className="py-20 border-t border-primary bg-gradient-to-br from-background to-secondary/30" aria-labelledby="senseis-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Senseis
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Profissionais dedicados a transmitir a tradição e os valores do karatê Shorin-Ryu
            </p>
          </div>

          {loadingSenseis ? (
            <LoadingGrid count={3} />
          ) : senseis.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum sensei encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {senseis.map((sensei) => (
                <Card key={sensei.id} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden group">
                  <div className="aspect-square overflow-hidden bg-muted/50 flex items-center justify-center">
                    {sensei.imageUrl ? (
                      <img src={sensei.imageUrl} alt={`Foto de ${sensei.name} - ${sensei.rank}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="text-muted-foreground">Foto do Sensei</div>
                    )}
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-1 text-card-foreground group-hover:text-primary transition-colors">
                      {sensei.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4 text-sm">
                      {BELT_GRADES.find(belt => belt.id === sensei.rank)?.name || sensei.rank}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {sensei.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>
    </section>

    {/* Values Section */}
      <section className="py-20 border-t border-primary bg-gradient-to-br from-background to-secondary/30 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Os pilares que sustentam nossa filosofia e guiam cada aluno em sua jornada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow">
                <CardContent className="p-6 text-center">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

    {/* Locations Section */}
      <section id="locations" className="py-20 border-t border-primary bg-gradient-to-br from-background to-secondary/30 scroll-mt-18">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Locais de Treino
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça cada um dos espaços onde levamos o karatê tradicional para a comunidade
            </p>
          </div>

          {loadingLocations ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando locais...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum local cadastrado.</p>
            </div>
          ) : (
            <Tabs defaultValue={locations[0]?.id} className="max-w-6xl mx-auto">
              <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${Math.min(locations.length, 4)}, minmax(0, 1fr))` }}>
                {locations.map((location) => (
                  <TabsTrigger key={location.id} value={location.id}>
                    {location.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {locations.map((location) => (
                <TabsContent key={location.id} value={location.id} className="animate-fade-in">
                  <Card className="border-primary/20 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      {location.imageUrl ? (
                        <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">Imagem do local</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="text-2xl font-bold text-card-foreground">{location.name}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {location.description || "Espaço dedicado ao treinamento de karatê tradicional."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-primary bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597408-26bc8e548a46?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Pronto para Começar sua Jornada?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Junte-se a nós e descubra o verdadeiro espírito do karatê tradicional
          </p>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="shadow-glow text-lg px-8">
              Entre em Contato
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};
export default Home;
