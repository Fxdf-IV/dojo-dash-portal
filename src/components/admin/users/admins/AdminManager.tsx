import { useState } from "react";
import { Plus, Trash2, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User, Location } from "@/types";
import { usersService } from "@/services";

interface AdminManagerProps {
  admins: User[];
  loading: boolean;
  onUpdate: (admins: User[]) => void;
}

export const AdminManager = ({
  admins,
  loading,
  onUpdate,
}: AdminManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    login: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      login: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleAdd = async () => {
    if (!form.name || !form.login || !form.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar um administrador",
        variant: "destructive",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação devem ser iguais",
        variant: "destructive",
      });
      return;
    }

    try {
      const newUser = await usersService.create({
        name: form.name,
        username: form.login, // Send as username
        password: form.password,
        role: "admin",
        status: "active",
      });

      onUpdate([...admins, newUser]);
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Administrador adicionado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao adicionar administrador",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersService.delete(id);
      onUpdate(admins.filter((a) => a.id !== id));
      setDeleteId(null);
      toast({ title: "Administrador removido com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover administrador",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    login: "",
    password: "",
    confirmPassword: "",
  });

  const handleEditClick = (admin: User) => {
    setEditingAdmin(admin);
    // Use username if available, otherwise email
    const login = admin.username || admin.email;
      
    setEditForm({
      name: admin.name || "",
      login: login,
      password: "",
      confirmPassword: "",
    });
  };

  const handleUpdate = async () => {
    if (!editingAdmin) return;

    if (!editForm.name || !editForm.login) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e Login são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação devem ser iguais",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedUser = await usersService.update(editingAdmin.id, {
        name: editForm.name,
        username: editForm.login, // Send as username
        password: editForm.password || undefined, // Only send if set
      });

      onUpdate(admins.map(a => a.id === editingAdmin.id ? updatedUser : a));
      setEditingAdmin(null);
      toast({ title: "Administrador atualizado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar administrador",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gerenciar Administradores</CardTitle>
            <CardDescription>
              Adicione e gerencie os administradores do sistema
            </CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Administrador</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo administrador
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="admin-name">Nome</Label>
                  <Input
                    id="admin-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-login">Login</Label>
                  <Input
                    id="admin-login"
                    type="text"
                    value={form.login}
                    onChange={(e) => setForm({ ...form, login: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Senha</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="admin-confirm-password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
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

          {/* Edit Dialog */}
          <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Administrador</DialogTitle>
                <DialogDescription>
                  Atualize os dados do administrador
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="edit-name">Nome</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-login">Login</Label>
                  <Input
                    id="edit-login"
                    type="text"
                    value={editForm.login}
                    onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Deixe em branco para manter"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="edit-confirm-password"
                    type="password"
                    placeholder="Deixe em branco para manter"
                    value={editForm.confirmPassword}
                    onChange={(e) =>
                      setEditForm({ ...editForm, confirmPassword: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingAdmin(null)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate}>Salvar Alterações</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Carregando administradores...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Nenhum administrador encontrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        {admin.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {admin.username || admin.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(admin)}
                        >
                          Editar
                        </Button>
                        <AlertDialog open={deleteId === admin.id} onOpenChange={(open) => {
                          if (!open) setDeleteId(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteId(admin.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover administrador</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este administrador? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(admin.id)}>
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
