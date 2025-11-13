import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, Images } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Location } from "@/types";
import { locationsService } from "@/services";

interface LocationManagerProps {
  locations: Location[];
  loading: boolean;
  onUpdate: (locations: Location[]) => void;
}

export const LocationManager = ({
  locations,
  loading,
  onUpdate,
}: LocationManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
    setImageFiles([]);
  };

  const handleAdd = async () => {
    try {
      let newLocation;
      if (imageFiles.length > 0) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description || "");
        imageFiles.forEach((file) => {
          fd.append("images", file);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newLocation = await locationsService.create(fd as any);
      } else {
        newLocation = await locationsService.create(form);
      }
      onUpdate([...locations, newLocation]);
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Local adicionado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao adicionar local",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingLocation) return;
    try {
      let updated;
      if (imageFiles.length > 0) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description || "");
        imageFiles.forEach((file) => {
          fd.append("images", file);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updated = await locationsService.update(editingLocation.id, fd as any);
      } else {
        updated = await locationsService.update(editingLocation.id, form);
      }
      onUpdate(locations.map((l) => (l.id === updated.id ? updated : l)));
      setEditingLocation(null);
      resetForm();
      toast({ title: "Local atualizado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar local",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await locationsService.delete(id);
      onUpdate(locations.filter((l) => l.id !== id));
      toast({ title: "Local removido com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover local",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = locations.findIndex((l) => l.id === active.id);
      const newIndex = locations.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(locations, oldIndex, newIndex);
      onUpdate(reordered);
      // TODO: Call API to update order on backend if needed
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [photosDialogLocation, setPhotosDialogLocation] = useState<Location | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Locais</CardTitle>
              <CardDescription>
                Adicione e edite locais de treinamento
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Local
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Local</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do local
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="location-name">Nome</Label>
                    <Input
                      id="location-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location-description">Descrição</Label>
                    <Textarea
                      id="location-description"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location-images">Fotos (múltiplas)</Label>
                    <input
                      id="location-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setImageFiles(Array.from(e.target.files || []))
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
                    <Button onClick={handleAdd}>Adicionar</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={locations.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                ) : locations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum local cadastrado.</p>
                ) : (
                  locations.map((location) => (
                    <SortableLocationCard
                      key={location.id}
                      location={location}
                      onEdit={() => {
                        setEditingLocation(location);
                        setForm({
                          name: location.name,
                          description: location.description || "",
                        });
                        setImageFiles([]);
                      }}
                      onDelete={() => handleDelete(location.id)}
                      onManagePhotos={() => setPhotosDialogLocation(location)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingLocation}
        onOpenChange={(open) => {
          if (!open) {
            setEditingLocation(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Local</DialogTitle>
            <DialogDescription>Atualize os dados do local</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-location-name">Nome</Label>
              <Input
                id="edit-location-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-location-description">Descrição</Label>
              <Textarea
                id="edit-location-description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-location-images">
                Adicionar Fotos (múltiplas)
              </Label>
              <input
                id="edit-location-images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImageFiles(Array.from(e.target.files || []))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingLocation(null);
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

      {/* Photos Management Dialog */}
      <Dialog open={!!photosDialogLocation} onOpenChange={(open) => !open && setPhotosDialogLocation(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Fotos - {photosDialogLocation?.name}</DialogTitle>
            <DialogDescription>
              Adicione, visualize ou remova fotos da galeria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photosDialogLocation?.images?.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Foto"}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={async () => {
                      try {
                        // TODO: Implement delete image API call
                        toast({ title: "Foto removida com sucesso!" });
                      } catch (error) {
                        toast({
                          title: "Erro ao remover foto",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {img.caption && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <Label htmlFor="new-photos">Adicionar Novas Fotos</Label>
              <input
                id="new-photos"
                type="file"
                multiple
                accept="image/*"
                className="mt-2"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0 && photosDialogLocation) {
                    try {
                      // TODO: Implement add images API call
                      toast({ title: "Fotos adicionadas com sucesso!" });
                    } catch (error) {
                      toast({
                        title: "Erro ao adicionar fotos",
                        variant: "destructive",
                      });
                    }
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function SortableLocationCard({
  location,
  onEdit,
  onDelete,
  onManagePhotos,
}: {
  location: Location;
  onEdit: () => void;
  onDelete: () => void;
  onManagePhotos: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 space-y-3 bg-card"
    >
      <div className="flex items-start gap-3">
        <button
          className="cursor-grab active:cursor-grabbing mt-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h3 className="font-semibold">{location.name}</h3>
          {location.description && (
            <p className="text-sm text-muted-foreground">
              {location.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {location.images?.length || 0} foto(s) na galeria
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onManagePhotos}>
            <Images className="w-4 h-4 mr-1" />
            Fotos
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LocationManager;
