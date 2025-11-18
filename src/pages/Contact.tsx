import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import { contactSettingsService, locationsService } from "@/services";
import type { Location } from "@/types";
import { SEO } from "@/components/SEO";

const DEFAULT_WHATSAPP_NUMBER = "18997558617";
const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, gostaria de conhecer o karatê do Alessandro Dojo. Como eu posso começar?";

const Contact = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [whatsappMessage, setWhatsappMessage] = useState(DEFAULT_WHATSAPP_MESSAGE);
  const [locations, setLocations] = useState<Location[]>([]);

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
  return <div className="min-h-screen pt-20">
      <SEO
        title="Contato - Alessandro Karatê e Kobudo"
        description="Entre em contato conosco. Tire suas dúvidas ou venha conhecer nossos dojos em Palmital, Marília e Pirapozinho. WhatsApp disponível."
        keywords="contato karate palmital, dojo palmital telefone, whatsapp karate, aulas karate contato"
      />
      {/* Hero Section */}
      <section className="relative py-20 border-b border-primary bg-gradient-hero" aria-labelledby="contact-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Tem dúvidas ou quer começar a treinar? Estamos prontos para ajudar você!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* WhatsApp Contact */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Entre em Contato</h2>
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground mb-6">
                      Clique no botão abaixo para conversar conosco via WhatsApp. Estamos prontos para responder suas dúvidas!
                    </p>
                    <Button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-glow flex items-center justify-center gap-2 py-6"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Entre em Contato pelo WhatsApp
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Você será redirecionado para o WhatsApp
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Informações de Contato</h2>
                <div className="space-y-4">
                  <Card className="border-primary/20 hover:border-primary transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">Telefone</p>
                        <p className="text-sm text-muted-foreground">(18) 99755-8617</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 hover:border-primary transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">alekaratepalmital1@gmail.com</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 hover:border-primary transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">Localização</p>
                        <p className="text-sm text-muted-foreground">Palmital - SP</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Redes Sociais</h3>
                <p className="text-muted-foreground mb-4">
                  Acompanhe nossas atividades, eventos e conquistas
                </p>
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/alessandrodokarate" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Facebook size={24} />
                  </a>
                  <a href="https://www.instagram.com/alessandrodokarate/" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Instagram size={24} />
                  </a>
                </div>
              </div>

              {/* Locations */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Nossos Locais</h3>
                {locations.length > 0 ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {locations.map((location) => (
                      <p key={location.id}>● {location.name}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum local cadastrado no momento.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Contact;
