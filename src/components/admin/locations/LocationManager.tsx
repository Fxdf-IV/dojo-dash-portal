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
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { useToast } from "@/hooks/use-toast";
import { Location, ScheduleItem } from "@/types";
import { locationsService } from "@/services";
import { LocationForm } from "./LocationForm";

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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    mapUrl: string;
    schedule: ScheduleItem[];
  }>({
    name: "",
    description: "",
    mapUrl: "",
    schedule: [],
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      mapUrl: "",
      schedule: [],
    });
    setImageFiles([]);
    setCoverImageFile(null);
  };

  const extractMapUrl = (input: string) => {
    if (input.includes("<iframe")) {
      const srcMatch = input.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : input;
    }
    return input;
  };

  const handleAdd = async () => {
    try {
      const cleanMapUrl = extractMapUrl(form.mapUrl);
      let newLocation;
      if (coverImageFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description || "");
        fd.append("mapUrl", cleanMapUrl || "");
        fd.append("schedule", JSON.stringify(form.schedule));
        fd.append("image", coverImageFile);
        newLocation = await locationsService.create(fd);
      } else {
        newLocation = await locationsService.create({
          name: form.name,
          description: form.description || "",
          mapUrl: cleanMapUrl || "",
          schedule: form.schedule,
        });
      }

      // Adicionar imagens da galeria se existirem
      if (imageFiles.length > 0) {
        const galleryFd = new FormData();
        imageFiles.forEach((file) => {
          galleryFd.append("images", file);
        });

        await locationsService.addImage(newLocation.id, galleryFd);

        // Recarregar o local para obter as imagens atualizadas
        const updatedLocation = await locationsService.getById(newLocation.id);
        onUpdate([...locations, updatedLocation]);
      } else {
        onUpdate([...locations, newLocation]);
      }

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
      const cleanMapUrl = extractMapUrl(form.mapUrl);
      let updated;
      if (coverImageFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description || "");
        fd.append("mapUrl", cleanMapUrl || "");
        fd.append("schedule", JSON.stringify(form.schedule));
        fd.append("image", coverImageFile);
        updated = await locationsService.update(editingLocation.id, fd);
      } else {
        updated = await locationsService.update(editingLocation.id, {
          name: form.name,
          description: form.description || "",
          mapUrl: cleanMapUrl || "",
          schedule: form.schedule,
        });
      }

      // Adicionar novas imagens à galeria se existirem
      if (imageFiles.length > 0) {
        const galleryFd = new FormData();
        imageFiles.forEach((file) => {
          galleryFd.append("images", file);
        });

        await locationsService.addImage(updated.id, galleryFd);

        // Recarregar o local para obter as imagens atualizadas
        const updatedWithImages = await locationsService.getById(updated.id);
        onUpdate(locations.map((l) => (l.id === updatedWithImages.id ? updatedWithImages : l)));
      } else {
        onUpdate(locations.map((l) => (l.id === updated.id ? updated : l)));
      }

      setEditingLocation(null);
      resetForm();

      const imageCount = imageFiles.length;
      const message = imageCount > 0
        ? `Local atualizado com sucesso! ${imageCount} foto(s) adicionada(s) à galeria.`
        : "Local atualizado com sucesso!";

      toast({ title: message });
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = locations.findIndex((l) => l.id === active.id);
      const newIndex = locations.findIndex((l) => l.id === over.id);
      const reordered = arrayMove(locations, oldIndex, newIndex);

      // Atualizar estado local imediatamente
      onUpdate(reordered);

      // Atualizar ordem no backend
      try {
        await locationsService.reorderLocations(reordered);
        toast({ title: "Ordem dos locais atualizada com sucesso!" });
      } catch (error) {
        toast({
          title: "Erro ao atualizar ordem",
          description: (error as Error).message,
          variant: "destructive",
        });
        // Voltar para ordem anterior em caso de erro
        onUpdate(locations);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [photosDialogLocation, setPhotosDialogLocation] = useState<Location | null>(null);
  const [isPhotosDialogOpen, setIsPhotosDialogOpen] = useState(false);
  const [newGalleryImageFiles, setNewGalleryImageFiles] = useState<File[]>([]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Gerenciar Locais</CardTitle>
              <CardDescription>
                Adicione e edite locais de treinamento
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Local
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Local</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do local
                  </DialogDescription>
                </DialogHeader>
                <LocationForm
                  form={form}
                  setForm={setForm}
                  coverImageFile={coverImageFile}
                  setCoverImageFile={setCoverImageFile}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  onSubmit={handleAdd}
                  onCancel={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  submitLabel="Adicionar"
                />
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
                          mapUrl: location.mapUrl || "",
                          schedule: location.schedule || [],
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
        <DialogContent className="max-h-[90vh] min-w-[35vw] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Local</DialogTitle>
            <DialogDescription>Atualize os dados do local</DialogDescription>
          </DialogHeader>
          <LocationForm
            form={form}
            setForm={setForm}
            coverImageFile={coverImageFile}
            setCoverImageFile={setCoverImageFile}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            onSubmit={handleEdit}
            onCancel={() => {
              setEditingLocation(null);
              resetForm();
            }}
            submitLabel="Salvar"
            currentImageUrl={editingLocation?.imageUrl}
            onRemoveCoverImage={async () => {
              setCoverImageFile(null);
              if (editingLocation) {
                try {
                  const updated = await locationsService.removeCoverImage(
                    editingLocation.id,
                    form.name,
                    form.description || "",
                    form.mapUrl || ""
                  );
                  onUpdate(locations.map(l => l.id === editingLocation.id ? updated : l));
                  setEditingLocation(updated);
                  toast({ title: "Imagem de capa removida com sucesso!" });
                } catch (error) {
                  toast({
                    title: "Erro ao remover imagem de capa",
                    description: (error as Error).message,
                    variant: "destructive",
                  });
                }
              }
            }}
          />
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
                        if (!photosDialogLocation) return;

                        // Remover imagem do backend
                        await locationsService.deleteImage(photosDialogLocation.id, idx);

                        // Atualizar estado local
                        const updatedImages = photosDialogLocation.images?.filter((_, i) => i !== idx) || [];
                        const updatedLocation = {
                          ...photosDialogLocation,
                          images: updatedImages,
                        };

                        // Atualizar lista de locais
                        onUpdate(locations.map(l => l.id === photosDialogLocation.id ? updatedLocation : l));
                        setPhotosDialogLocation(updatedLocation);

                        toast({ title: "Foto removida com sucesso!" });
                      } catch (error) {
                        toast({
                          title: "Erro ao remover foto",
                          description: (error as Error).message,
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
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium">Adicionar Novas Fotos à Galeria</h4>
              <MultipleImageUpload
                label="Novas Fotos"
                value={newGalleryImageFiles}
                onChange={setNewGalleryImageFiles}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                maxSize={5}
                maxFiles={10}
                placeholder="Selecione múltiplas imagens para adicionar à galeria"
              />
              <Button
                onClick={async () => {
                  if (newGalleryImageFiles.length > 0 && photosDialogLocation) {
                    try {
                      const galleryFd = new FormData();
                      newGalleryImageFiles.forEach((file) => {
                        galleryFd.append("images", file);
                      });

                      await locationsService.addImage(photosDialogLocation.id, galleryFd);

                      // Recarregar o local para obter as imagens atualizadas
                      const updatedLocation = await locationsService.getById(photosDialogLocation.id);

                      onUpdate(locations.map(l => l.id === photosDialogLocation.id ? updatedLocation : l));
                      setPhotosDialogLocation(updatedLocation);
                      setNewGalleryImageFiles([]);

                      toast({
                        title: `${newGalleryImageFiles.length} foto(s) adicionada(s) com sucesso!`
                      });
                    } catch (error) {
                      toast({
                        title: "Erro ao adicionar fotos",
                        description: (error as Error).message,
                        variant: "destructive",
                      });
                    }
                  }
                }}
                disabled={newGalleryImageFiles.length === 0}
                className="w-full"
              >
                Adicionar {newGalleryImageFiles.length > 0 ? `${newGalleryImageFiles.length} ` : ""}Foto(s) à Galeria
              </Button>
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
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex items-center w-full sm:w-auto gap-3">
          <button
            className="cursor-grab active:cursor-grabbing mt-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 sm:hidden">
            <h3 className="font-semibold">{location.name}</h3>
          </div>
        </div>

        <div className="flex-1 w-full">
          <h3 className="font-semibold hidden sm:block">{location.name}</h3>
          {location.description && (
            <p className="text-sm text-muted-foreground">
              {location.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {location.images?.length || 0} foto(s) na galeria
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="icon" onClick={onManagePhotos} className="sm:flex-none" title="Fotos">
            <Images className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onEdit} className="sm:flex-none" title="Editar">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete} className="sm:flex-none" title="Remover">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LocationManager;
