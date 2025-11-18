import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { eventsService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { normalizeImageUrl } from "@/utils/imageUrl";

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar eventos",
        description: error.message || "Não foi possível carregar os eventos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para se inscrever em eventos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setRegistering(eventId);
      const updatedEvent = await eventsService.register(eventId);
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
      toast({
        title: "Inscrição confirmada!",
        description: "Sua presença foi confirmada no evento.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao se inscrever",
        description: error.message || "Não foi possível confirmar sua presença.",
        variant: "destructive",
      });
    } finally {
      setRegistering(null);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user) return;

    try {
      setRegistering(eventId);
      const updatedEvent = await eventsService.unregister(eventId);
      setEvents(events.map(e => e.id === eventId ? updatedEvent : e));
      toast({
        title: "Inscrição cancelada",
        description: "Sua presença foi cancelada no evento.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar inscrição",
        description: error.message || "Não foi possível cancelar sua inscrição.",
        variant: "destructive",
      });
    } finally {
      setRegistering(null);
    }
  };

  const isRegistered = (event: Event) => {
    if (!user) return false;
    return event.registeredStudents.includes(user.id);
  };

  const isPastEvent = (event: Event) => {
    return new Date(event.date) < new Date();
  };

  const upcomingEvents = events.filter(e => !isPastEvent(e));
  const pastEvents = events.filter(e => isPastEvent(e));

  const renderEventImage = (imageUrl?: string, title?: string) => {
    const normalized = normalizeImageUrl(imageUrl);
    const src = normalized || "/placeholder.svg";
    return (
      <div className="aspect-video overflow-hidden bg-muted/50">
        <img
          src={src}
          alt={title || "Imagem do evento"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 border-b border-primary bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Eventos
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Participe dos eventos do dojo e acompanhe nossa agenda de atividades
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Próximos Eventos
          </h2>
          {loading && (
            <div className="text-center text-muted-foreground py-12">
              <p>Carregando eventos...</p>
            </div>
          )}
          {!loading && upcomingEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Não há eventos programados no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden">
                  {renderEventImage(event.imageUrl, event.title)}
                  <CardHeader>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(event.date), "HH:mm")}
                      </span>
                      {event.registrationPrice !== undefined && event.registrationPrice > 0 && (
                        <span className="flex items-center gap-1 text-primary font-semibold">
                          <DollarSign className="w-4 h-4" />
                          R$ {event.registrationPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      {(!event.registrationPrice || event.registrationPrice === 0) && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                          Gratuito
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event.description && (
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.registeredCount} inscrito(s)</span>
                      </div>
                      {user && (
                        <Button
                          onClick={() =>
                            isRegistered(event)
                              ? handleUnregister(event.id)
                              : handleRegister(event.id)
                          }
                          disabled={registering === event.id}
                          variant={isRegistered(event) ? "outline" : "default"}
                          size="sm"
                        >
                          {registering === event.id ? (
                            "Processando..."
                          ) : isRegistered(event) ? (
                            <>
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirmar Presença
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {!user && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Faça login para se inscrever no evento
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
              Eventos Anteriores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="border-primary/20 opacity-75">
                  {renderEventImage(event.imageUrl, event.title)}
                  <CardHeader>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      {event.registrationPrice !== undefined && event.registrationPrice > 0 && (
                        <span className="flex items-center gap-1 text-primary font-semibold">
                          <DollarSign className="w-4 h-4" />
                          R$ {event.registrationPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      {(!event.registrationPrice || event.registrationPrice === 0) && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                          Gratuito
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event.description && (
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.registeredCount} participante(s)</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Evento Realizado
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;

