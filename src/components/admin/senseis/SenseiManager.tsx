import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newSensei = await senseisService.create(fd as any);
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
      let updated;
      if (imageFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("rank", form.rank);
        fd.append("description", form.description || "");
        fd.append("orderIndex", form.orderIndex.toString());
        fd.append("image", imageFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updated = await senseisService.update(editingSensei.id, fd as any);
      } else {
        updated = await senseisService.update(editingSensei.id, form);
      }
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
                    <Input
                      id="sensei-rank"
                      value={form.rank}
                      onChange={(e) => setForm({ ...form, rank: e.target.value })}
                      placeholder="Ex: 3º Dan"
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
                  <div>
                    <Label htmlFor="sensei-order">Ordem de Exibição</Label>
                    <Input
                      id="sensei-order"
                      type="number"
                      value={form.orderIndex}
                      onChange={(e) =>
                        setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sensei-image">Foto</Label>
                    <input
                      id="sensei-image"
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
                    <Button onClick={handleAdd}>Adicionar</Button>
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
            ) : senseis.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum sensei cadastrado.</p>
            ) : (
              senseis
                .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                .map((sensei) => (
                  <div
                    key={sensei.id}
                    className="border rounded-lg p-4 flex items-start gap-4"
                  >
                    <div className="text-muted-foreground pt-1">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {sensei.imageUrl && (
                      <img
                        src={sensei.imageUrl}
                        alt={sensei.name}
                        className="w-24 h-24 rounded-md object-cover flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{sensei.name}</h3>
                      <p className="text-sm text-primary font-medium">{sensei.rank}</p>
                      {sensei.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {sensei.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Ordem: {sensei.orderIndex || 0}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSensei(sensei);
                          setForm({
                            name: sensei.name,
                            rank: sensei.rank,
                            description: sensei.description || "",
                            orderIndex: sensei.orderIndex || 0,
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
                        onClick={() => handleDelete(sensei.id)}
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
              <Label htmlFor="edit-sensei-rank">Faixa/Grau</Label>
              <Input
                id="edit-sensei-rank"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
                placeholder="Ex: 3º Dan"
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
            <div>
              <Label htmlFor="edit-sensei-order">Ordem de Exibição</Label>
              <Input
                id="edit-sensei-order"
                type="number"
                value={form.orderIndex}
                onChange={(e) =>
                  setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-sensei-image">Foto</Label>
              <input
                id="edit-sensei-image"
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

export default SenseiManager;
