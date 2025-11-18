import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
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
import { BELT_GRADES, BeltSelect } from "@/components/BeltSelect";
import { ImageUpload } from "@/components/ui/image-upload";

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
import { Sensei } from "@/types";
import { senseisService } from "@/services";

interface SenseiManagerProps {
  senseis: Sensei[];
  loading: boolean;
  onUpdate: (senseis: Sensei[]) => void;
}

export const SenseiManager = ({
  senseis,
  loading,
  onUpdate,
}: SenseiManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSensei, setEditingSensei] = useState<Sensei | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    rank: "",
    description: "",
    orderIndex: 0,
  });

  const resetForm = () => {
    setForm({
      name: "",
      rank: "",
      description: "",
      orderIndex: 0,
    });
    setImageFile(null);
  };

  const handleAdd = async () => {
    try {
      let newSensei;
      if (imageFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("rank", form.rank);
        fd.append("description", form.description || "");
        fd.append("orderIndex", form.orderIndex.toString());
        fd.append("image", imageFile);
        newSensei = await senseisService.create(fd);
      } else {
        newSensei = await senseisService.create(form);
      }
      onUpdate([...senseis, newSensei]);
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Sensei adicionado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao adicionar sensei",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingSensei) return;
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("rank", form.rank);
      fd.append("description", form.description || "");
      fd.append("orderIndex", form.orderIndex.toString());
      
      if (imageFile) {
        fd.append("image", imageFile);
      }
      
      const updated = await senseisService.update(editingSensei.id, fd);
      onUpdate(senseis.map((s) => (s.id === updated.id ? updated : s)));
      setEditingSensei(null);
      resetForm();
      toast({ title: "Sensei atualizado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar sensei",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await senseisService.delete(id);
      onUpdate(senseis.filter((s) => s.id !== id));
      toast({ title: "Sensei removido com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover sensei",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = senseis.findIndex((s) => s.id === active.id);
      const newIndex = senseis.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(senseis, oldIndex, newIndex).map((s, idx) => ({
        ...s,
        orderIndex: idx,
      }));
      onUpdate(reordered);

      // Chamar API para atualizar ordem no backend
      senseisService.reorderSenseis(reordered).catch((error) => {
        toast({
          title: 'Erro ao atualizar ordem',
          description: error.message,
          variant: 'destructive',
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciar Senseis</CardTitle>
              <CardDescription>
                Adicione e edite instrutores
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Sensei
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Sensei</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do instrutor
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="sensei-name">Nome</Label>
                    <Input
                      id="sensei-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sensei-rank">Faixa/Grau</Label>
                    <BeltSelect
                      onlyDan={true}
                      value={form.rank}
                      onValueChange={(value) => setForm({ ...form, rank: value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sensei-description">Descrição</Label>
                    <Textarea
                      id="sensei-description"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <ImageUpload
                    label="Foto do Sensei"
                    onChange={(file) => setImageFile(file)}
                    onRemove={() => setImageFile(null)}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    maxSize={5}
                  />
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
              items={senseis.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                ) : senseis.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum sensei cadastrado.</p>
                ) : (
                  senseis
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((sensei) => (
                      <SortableSenseiCard
                        key={sensei.id}
                        sensei={sensei}
                        onEdit={() => {
                          setEditingSensei(sensei);
                          setForm({
                            name: sensei.name,
                            rank: sensei.rank,
                            description: sensei.description || "",
                            orderIndex: sensei.orderIndex || 0,
                          });
                          setImageFile(null);
                        }}
                        onDelete={() => handleDelete(sensei.id)}
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
        open={!!editingSensei}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSensei(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sensei</DialogTitle>
            <DialogDescription>Atualize os dados do instrutor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-sensei-name">Nome</Label>
              <Input
                id="edit-sensei-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="sensei-rank">Faixa/Grau</Label>
              <BeltSelect
                onlyDan={true}
                value={form.rank}
                onValueChange={(value) => setForm({ ...form, rank: value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-sensei-description">Descrição</Label>
              <Textarea
                id="edit-sensei-description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <ImageUpload
              label="Foto do Sensei"
              value={editingSensei?.imageUrl}
              onChange={(file) => setImageFile(file)}
              onRemove={async () => {
                setImageFile(null);
                if (editingSensei) {
                  try {
                    const updated = await senseisService.removeSenseiImage(
                      editingSensei.id
                    );

                    // Atualizar lista local
                    onUpdate(senseis.map(s => s.id === editingSensei.id ? updated : s));

                    // Atualizar local sendo editado
                    setEditingSensei(updated);

                    toast({ title: "Foto do Sensei removida com sucesso!" });
                  } catch (error) {
                    toast({
                      title: "Erro ao remover foto do Sensei",
                      description: (error as Error).message,
                      variant: "destructive",
                    });
                  }
                }
              }}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              maxSize={5}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingSensei(null);
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

function SortableSenseiCard({
  sensei,
  onEdit,
  onDelete,
}: {
  sensei: Sensei;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sensei.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 flex items-start gap-4 bg-card"
    >
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground pt-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {sensei.imageUrl && (
        <img
          src={sensei.imageUrl}
          alt={sensei.name}
          className="w-24 h-24 rounded-md object-cover flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold">{sensei.name}</h3>
        <p className="text-sm text-primary font-medium">
          {BELT_GRADES.find((b) => b.id === sensei.rank)?.name || sensei.rank}
        </p>
        {sensei.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {sensei.description}
          </p>
        )}
      </div>

      <div className="flex gap-2 flex-shrink-0">
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
  );
}

export default SenseiManager;
