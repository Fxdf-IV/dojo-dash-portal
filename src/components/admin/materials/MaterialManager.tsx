import { useState, useMemo } from "react";
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
import { BeltSelect, BELT_GRADES } from "@/components/BeltSelect";
import { useToast } from "@/hooks/use-toast";
import { Material } from "@/types";
import { materialsService } from "@/services";

interface MaterialManagerProps {
  materials: Material[];
  loading: boolean;
  onUpdate: (materials: Material[]) => void;
}

export const MaterialManager = ({
  materials,
  loading,
  onUpdate,
}: MaterialManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    type: "kihon" as "kihon" | "kata" | "theory" | "bunkai",
    description: "",
    content: "",
    videoUrl: "",
    imageUrl: "",
    minBeltId: "white",
  });

  const materialsByType = useMemo(
    () => ({
      kihon: materials.filter((m) => m.type === "kihon"),
      kata: materials.filter((m) => m.type === "kata"),
      theory: materials.filter((m) => m.type === "theory"),
      bunkai: materials.filter((m) => m.type === "bunkai"),
    }),
    [materials]
  );

  const resetForm = () => {
    setForm({
      title: "",
      type: "kihon",
      description: "",
      content: "",
      videoUrl: "",
      imageUrl: "",
      minBeltId: "white",
    });
    setImageFile(null);
    setVideoFile(null);
  };

  const handleAdd = async () => {
    try {
      let newMaterial;
      if (imageFile || videoFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("type", form.type);
        fd.append("description", form.description || "");
        fd.append("content", form.content || "");
        fd.append("minBeltId", form.minBeltId);
        if (imageFile) fd.append("image", imageFile);
        if (videoFile) fd.append("video", videoFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newMaterial = await materialsService.create(fd as any);
      } else {
        newMaterial = await materialsService.create(form);
      }
      onUpdate([...materials, newMaterial]);
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Material adicionado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao adicionar material",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingMaterial) return;
    try {
      let updated;
      if (imageFile || videoFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("type", form.type);
        fd.append("description", form.description || "");
        fd.append("content", form.content || "");
        fd.append("minBeltId", form.minBeltId);
        if (imageFile) fd.append("image", imageFile);
        if (videoFile) fd.append("video", videoFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updated = await materialsService.update(editingMaterial.id, fd as any);
      } else {
        updated = await materialsService.update(editingMaterial.id, form);
      }
      onUpdate(materials.map((m) => (m.id === updated.id ? updated : m)));
      setEditingMaterial(null);
      resetForm();
      toast({ title: "Material atualizado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar material",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await materialsService.delete(id);
      onUpdate(materials.filter((m) => m.id !== id));
      toast({ title: "Material removido com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover material",
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
              <CardTitle>Gerenciar Materiais</CardTitle>
              <CardDescription>
                Adicione e edite conteúdos para os alunos
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Material</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do material
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="material-title">Título</Label>
                    <Input
                      id="material-title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-type">Tipo</Label>
                    <select
                      id="material-type"
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value as
                            | "kihon"
                            | "kata"
                            | "theory"
                            | "bunkai",
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="kihon">Kihon</option>
                      <option value="kata">Kata</option>
                      <option value="theory">Teoria</option>
                      <option value="bunkai">Bunkai</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="material-desc">Descrição</Label>
                    <Textarea
                      id="material-desc"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-content">Conteúdo</Label>
                    <Textarea
                      id="material-content"
                      value={form.content || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-video">Upload Vídeo</Label>
                    <input
                      id="material-video"
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={(e) =>
                        setVideoFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-image">Upload Imagem</Label>
                    <input
                      id="material-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-min-belt">Faixa Mínima</Label>
                    <BeltSelect
                      value={form.minBeltId}
                      onValueChange={(value) =>
                        setForm({ ...form, minBeltId: value })
                      }
                      placeholder="Escolha a faixa mínima"
                      onlyDan={false}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries({
              kihon: "Kihons",
              kata: "Katas",
              theory: "Teoria",
              bunkai: "Bunkai",
            }).map(([type, label]) => (
              <Card key={type} className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">{label}</CardTitle>
                  <CardDescription>
                    {
                      materialsByType[type as keyof typeof materialsByType]
                        .length
                    }{" "}
                    materiais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaterialsList
                    items={
                      materialsByType[type as keyof typeof materialsByType]
                    }
                    onEdit={(m) => {
                      setEditingMaterial(m);
                      setForm({
                        title: m.title,
                        type: m.type,
                        description: m.description || "",
                        content: m.content || "",
                        videoUrl: m.videoUrl || "",
                        imageUrl: m.imageUrl || "",
                        minBeltId: m.minBeltId || "white",
                      });
                      setImageFile(null);
                      setVideoFile(null);
                    }}
                    onDelete={handleDelete}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingMaterial} onOpenChange={(open) => {
        if (!open) {
          setEditingMaterial(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
            <DialogDescription>Atualize os dados do material</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-material-title">Título</Label>
              <Input
                id="edit-material-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-material-desc">Descrição</Label>
              <Textarea
                id="edit-material-desc"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-material-content">Conteúdo</Label>
              <Textarea
                id="edit-material-content"
                value={form.content || ""}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-material-video">Vídeo</Label>
              <input
                id="edit-material-video"
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-material-image">Imagem</Label>
              <input
                id="edit-material-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-material-min-belt">Faixa Mínima</Label>
              <BeltSelect
                value={form.minBeltId}
                onValueChange={(value) =>
                  setForm({ ...form, minBeltId: value })
                }
                placeholder="Escolha a faixa mínima"
                onlyDan={false}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingMaterial(null);
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

function MaterialsList({
  items,
  onEdit,
  onDelete,
}: {
  items: Material[];
  onEdit: (m: Material) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum material ainda.</p>
      )}
      <div className="space-y-2">
        {items.map((m) => (
          <div
            key={m.id}
            className="border rounded-lg p-3 bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium break-words">{m.title}</p>
              {m.minBeltId && (
                <p className="text-xs text-muted-foreground">
                  Mínimo: {BELT_GRADES.find((g) => g.id === m.minBeltId)?.name}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(m)}
                  className="flex-1"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(m.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remover
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialManager;
