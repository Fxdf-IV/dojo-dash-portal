import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, MapPinOff } from "lucide-react";
import { contactSettingsService, locationsService } from "@/services";
import type { Location } from "@/types";
import { SEO } from "@/components/SEO";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import HERO_IMAGE from "@/assets/images/hero/ContactCover.webp";

const DEFAULT_WHATSAPP_NUMBER = "18987654321";
const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, gostaria de conhecer o karatê do Dojo Dash. Como eu posso começar?";

const Contact = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [whatsappMessage, setWhatsappMessage] = useState(DEFAULT_WHATSAPP_MESSAGE);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await contactSettingsService.getSettings();
        const fetchedNumber = settings?.whatsappNumber?.trim();
        const fetchedMessage = settings?.whatsappMessage?.trim();

        setWhatsappNumber(fetchedNumber || DEFAULT_WHATSAPP_NUMBER);
        setWhatsappMessage(fetchedMessage || DEFAULT_WHATSAPP_MESSAGE);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        // Usar valores padrão em caso de erro
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await locationsService.getAll();
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
        setLocations([]);
      }
    };

    loadLocations();
  }, []);

  const handleWhatsAppClick = () => {
    const number = whatsappNumber?.trim() || DEFAULT_WHATSAPP_NUMBER;
    const message = whatsappMessage?.trim() || DEFAULT_WHATSAPP_MESSAGE;

    // Remover caracteres especiais e apenas manter números
    const cleanNumber = number.replace(/\D/g, "");
    if (!cleanNumber) return;

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    // Criar link do WhatsApp
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };



  return (
    <div className="min-h-screen pt-20">
      <SEO
        title="Contato - Dojo Dash Portal"
        description="Entre em contato conosco. Tire suas dúvidas ou venha conhecer nossos dojos em Cidade Exemplo, Marília e Pirapozinho. WhatsApp disponível."
        keywords="contato karate Cidade Exemplo, dojo Cidade Exemplo telefone, whatsapp karate, aulas karate contato"
      />
      {/* Hero Section */}
      <section
        className="relative py-20 bg-gradient-hero"
        aria-labelledby="gallery-hero"
      >
        <div
          className="absolute inset-0 bg-[center_30%] opacity-20 bg-fixed"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1
            id="gallery-hero"
            className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6"
          >
            Entre em Contato
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Essa área é dedicada a você fornecer as suas informações de contato.
            Assim como você pode nos enviar uma mensagem caso tenha interesse em saber mais sobre o projeto.
          </p>
        </div>
      </section>
      <AnimatedDivider />

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">

          {/* Contact Info & WhatsApp Section */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* WhatsApp */}
            <div className="space-y-8 h-full">
              <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Fale Conosco
                </h2>
                <Card className="border-primary/20 shadow-lg flex-1 flex flex-col justify-center">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <p className="text-muted-foreground text-lg text-center">
                        Clique no botão abaixo para conversar conosco via WhatsApp.
                        Estamos prontos para responder suas dúvidas! <br />
                        <strong>Coloque agora seu negócio online!</strong>
                      </p>
                      <Button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-[0_0_40px_rgba(22,163,74,0.3)] flex items-center justify-center gap-3 py-8 text-xl transition-transform hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-8 h-8" />
                        Conversar no WhatsApp
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Você será redirecionado para o WhatsApp
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 h-full">
              <div className="h-full flex flex-col">
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Informações de Contato
                </h2>
                <div className="grid gap-4 content-between flex-1">
                <Card className="border-primary/20 hover:border-primary transition-all group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Telefone</p>
                      <p className="text-sm text-muted-foreground">
                        (00) 00000-0000
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary transition-all group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">
                        contato@exemplo.com
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary transition-all group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">
                        Localização
                      </p>
                      <p className="text-sm text-muted-foreground">Cidade Exemplo - EX</p>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Top Section: Map & Locations */}
          <div className="grid lg:grid-cols-3 gap-8 lg:h-[600px]">

            {/* Map - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 h-[500px] lg:h-full">
              <Card className="border-primary/20 overflow-hidden h-full shadow-lg flex flex-col">
                <div className="p-4 border-b bg-card">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    Exiba as localizações do seu negócio
                  </h2>
                </div>
                <CardContent className="p-0 flex-1 bg-muted/50 relative">
                  {selectedLocation ? (
                    selectedLocation.mapUrl ? (
                      <iframe
                        width="100%"
                        height="100%"
                        id="gmap_canvas"
                        src={selectedLocation.mapUrl}
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="Mapa do Dojo"
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
                        <div className="text-center p-6">
                          <MapPinOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="font-medium">Localização indisponível</p>
                          <p className="text-sm mt-1">
                            Este local não possui um link de mapa cadastrado.
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Selecione um local para ver no mapa</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Locations List - Takes 1 column */}
            <div className="h-[500px] lg:h-full flex flex-col">
              <Card className="h-full border-primary/20 shadow-md flex flex-col overflow-hidden">
                <div className="p-6 border-b bg-card">
                  <h3 className="text-xl font-bold">Seus locais</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selecione para visualizar no mapa
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-background/50">
                  {locations.length > 0 ? (
                    locations.map((location) => (
                      <Card
                        key={location.id}
                        className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                          selectedLocation?.id === location.id
                            ? "border-primary bg-primary/10 shadow-glow"
                            : "border-border bg-card"
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <MapPin
                            className={`w-5 h-5 flex-shrink-0 ${
                              selectedLocation?.id === location.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`font-medium truncate ${
                                selectedLocation?.id === location.id
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {location.name}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhum local cadastrado no momento.
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <AnimatedDivider />
    </div>
  );
};
export default Contact;
