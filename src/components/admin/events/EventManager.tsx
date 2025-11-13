import { useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { eventsService } from "@/services";

interface EventManagerProps {
  events: Event[];
  loading: boolean;
  onUpdate: (events: Event[]) => void;
}

const formatPrice = (price: number | undefined): string => {
  if (!price || price === 0) return "Grátis";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export const EventManager = ({
  events,
  loading,
  onUpdate,
}: EventManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    registrationPrice: 0,
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      registrationPrice: 0,
    });
    setImageFile(null);
  };

  const handleAdd = async () => {
    try {
      let newEvent;
      if (imageFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description || "");
        fd.append("date", form.date);
        fd.append("registrationPrice", form.registrationPrice.toString());
        fd.append("image", imageFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newEvent = await eventsService.create(fd as any);
      } else {
        newEvent = await eventsService.create(form);
      }
      onUpdate([...events, newEvent]);
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Evento adicionado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao adicionar evento",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingEvent) return;
    try {
      let updated;
      if (imageFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description || "");
        fd.append("date", form.date);
        fd.append("registrationPrice", form.registrationPrice.toString());
        fd.append("image", imageFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updated = await eventsService.update(editingEvent.id, fd as any);
      } else {
        updated = await eventsService.update(editingEvent.id, form);
      }
      onUpdate(events.map((e) => (e.id === updated.id ? updated : e)));
      setEditingEvent(null);
      resetForm();
      toast({ title: "Evento atualizado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar evento",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eventsService.delete(id);
      onUpdate(events.filter((e) => e.id !== id));
      toast({ title: "Evento removido com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover evento",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Eventos</CardTitle>
              <CardDescription>
                Crie e edite eventos de treinamento
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Evento</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do evento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="event-title">Título</Label>
                    <Input
                      id="event-title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-description">Descrição</Label>
                    <Textarea
                      id="event-description"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="event-date">Data</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-price">Preço (R$)</Label>
                      <Input
                        id="event-price"
                        type="number"
                        step="0.01"
                        value={form.registrationPrice || 0}
                        onChange={(e) =>
                          setForm({ ...form, registrationPrice: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="event-image">Imagem</Label>
                    <input
                      id="event-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddOpen(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleAdd}>Criar</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>
            ) : (
              events
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 flex items-start gap-4"
                  >
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-24 h-24 rounded-md object-cover flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(event.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <span className="font-medium text-primary">
                          {formatPrice(event.registrationPrice)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{event.registeredCount || 0} inscritos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingEvent(event);
                          setForm({
                            title: event.title,
                            description: event.description || "",
                            date: event.date,
                            registrationPrice: event.registrationPrice || 0,
                          });
                          setImageFile(null);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEvent(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>Atualize os dados do evento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-event-title">Título</Label>
              <Input
                id="edit-event-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-event-description">Descrição</Label>
              <Textarea
                id="edit-event-description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit-event-date">Data</Label>
                <Input
                  id="edit-event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-event-price">Preço (R$)</Label>
                <Input
                  id="edit-event-price"
                  type="number"
                  step="0.01"
                  value={form.registrationPrice || 0}
                  onChange={(e) =>
                    setForm({ ...form, registrationPrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-event-image">Imagem</Label>
              <input
                id="edit-event-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingEvent(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleEdit}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventManager;
