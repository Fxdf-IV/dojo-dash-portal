import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            ) : locations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum local cadastrado.</p>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{location.name}</h3>
                      {location.description && (
                        <p className="text-sm text-muted-foreground">
                          {location.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingLocation(location);
                          setForm({
                            name: location.name,
                            description: location.description || "",
                          });
                          setImageFiles([]);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>

                  {location.images && location.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {location.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative bg-muted rounded-md overflow-hidden aspect-square"
                        >
                          <img
                            src={img.imageUrl}
                            alt={`${location.name} - ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {img.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
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
    </>
  );
};

export default LocationManager;
