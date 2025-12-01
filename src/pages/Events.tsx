import { useEffect, useState } from "react";
import { eventsService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types";
import { SEO } from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingStates";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import HERO_IMAGE from "@/assets/images/hero/EventCover.webp";
import { EventCard } from "@/components/EventCard";

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
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Erro ao carregar eventos",
        description: err.message || "Não foi possível carregar os eventos.",
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
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Erro ao se inscrever",
        description: err.message || "Não foi possível confirmar sua presença.",
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
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Erro ao cancelar inscrição",
        description: err.message || "Não foi possível cancelar sua inscrição.",
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



  return (
    <div className="min-h-screen pt-20">
      <SEO
        title="Eventos - Alessandro Karatê e Kobudo"
        description="Acompanhe os próximos eventos, campeonatos e atividades do dojo. Faça sua inscrição e participe das competições de karatê e kobudo."
        keywords="eventos karate, campeonato karate palmital, competições artes marciais, treinos especiais"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero" aria-labelledby="gallery-hero">
              <div
                className="absolute inset-0 opacity-20 bg-fixed bg-[length:100%_auto] bg-[center_5rem] bg-no-repeat" 
                style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
              />
              <div className="container mx-auto px-4 relative z-10">
                <h1 id="gallery-hero" className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
                  Eventos
                </h1>
                <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
                  Participe dos eventos do dojo e acompanhe nossa agenda de atividades.
                </p>
              </div>
          </section>
          <AnimatedDivider />

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Próximos Eventos
          </h2>
          {loading ? (
            <LoadingSpinner />
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Não há eventos programados no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={isRegistered(event)}
                  isRegistering={registering === event.id}
                  isPast={false}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  showActions={!!user}
                />
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
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={isRegistered(event)}
                  isRegistering={false}
                  isPast={true}
                  onRegister={() => {}}
                  onUnregister={() => {}}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <AnimatedDivider />
    </div>
  );
};

export default Events;

