import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { normalizeImageUrl } from "@/utils/imageUrl";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  isRegistering: boolean;
  isPast: boolean;
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  showActions?: boolean;
}

export const EventCard = ({
  event,
  isRegistered,
  isRegistering,
  isPast,
  onRegister,
  onUnregister,
  showActions = true,
}: EventCardProps) => {
  const renderEventImage = (imageUrl?: string, title?: string) => {
    const normalized = normalizeImageUrl(imageUrl);
    const src = normalized || "/placeholder.svg";
    return (
      <div className="aspect-video overflow-hidden bg-muted/50">
        <img
          src={src}
          alt={title ? `Imagem do evento ${title}` : "Imagem do evento"}
          className="w-full h-full object-cover"
          loading="lazy"
          width="640"
          height="360"
        />
      </div>
    );
  };

  return (
    <Card className={`border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden ${isPast ? "opacity-75" : ""}`}>
      {renderEventImage(event.imageUrl, event.title)}
      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          {!isPast && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(new Date(event.date), "HH:mm")}
            </span>
          )}
          {event.registrationPrice !== undefined && event.registrationPrice > 0 && (
            <span className="flex items-center gap-1 text-primary font-semibold">
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
            <span>{event.registeredCount} {isPast ? "participante(s)" : "inscrito(s)"}</span>
          </div>
          
          {isPast ? (
            <Badge variant="secondary" className="mt-2">
              Evento Realizado
            </Badge>
          ) : showActions ? (
            <Button
              onClick={() =>
                isRegistered
                  ? onUnregister(event.id)
                  : onRegister(event.id)
              }
              disabled={isRegistering}
              variant={isRegistered ? "outline" : "default"}
              size="sm"
            >
              {isRegistering ? (
                "Processando..."
              ) : isRegistered ? (
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
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              Faça login para se inscrever no evento
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
