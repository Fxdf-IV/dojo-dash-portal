import { useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import BeltBadge from "@/components/BeltBadge";
import { BeltSelect } from "@/components/BeltSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types";
import { studentsService } from "@/services";

interface StudentManagerProps {
  students: Student[];
  loading: boolean;
  userId?: string;
  onUpdate: (students: Student[]) => void;
}

export const StudentManager = ({
  students,
  loading,
  userId,
  onUpdate,
}: StudentManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    email: "",
    phone: "",
    beltId: "white",
    location: "",
    status: "active" as "active" | "pending" | "inactive",
  });

  const resetForm = () => {
    setForm({
      name: "",
      birthDate: "",
      email: "",
      phone: "",
      beltId: "white",
      location: "",
      status: "active",
    });
  };

  const handleAdd = async () => {
    try {
      const newStudent = await studentsService.create(form);
      onUpdate([...students, newStudent]);
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Aluno adicionado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao adicionar aluno",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingStudent) return;
    try {
      const updated = await studentsService.update(editingStudent.id, form);
      onUpdate(students.map((s) => (s.id === updated.id ? updated : s)));
      setIsEditOpen(false);
      setEditingStudent(null);
      resetForm();
      toast({ title: "Aluno atualizado com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao atualizar aluno",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await studentsService.delete(id);
      onUpdate(students.filter((s) => s.id !== id));
      setDeleteId(null);
      toast({ title: "Aluno removido com sucesso!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao remover aluno",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const student = students.find((s) => s.id === id);
      if (!student) return;
      const updated = await studentsService.update(id, { ...student, status: "active" });
      onUpdate(students.map((s) => (s.id === updated.id ? updated : s)));
      toast({ title: "Aluno aprovado!" });
    } catch (error: unknown) {
      toast({
        title: "Erro ao aprovar aluno",
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
              <CardTitle>Gerenciar Alunos</CardTitle>
              <CardDescription>
                Adicione, edite e gerencie os alunos
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Aluno
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Aluno</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do aluno
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="student-name">Nome</Label>
                    <Input
                      id="student-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-phone">Telefone</Label>
                    <Input
                      id="student-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-birthdate">Data de Nascimento</Label>
                    <Input
                      id="student-birthdate"
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-belt">Faixa</Label>
                    <BeltSelect
                      value={form.beltId}
                      onValueChange={(value) => setForm({ ...form, beltId: value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-location">Local</Label>
                    <Input
                      id="student-location"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Local de treinamento"
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
          <div className="border rounded-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Carregando alunos...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Faixa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <BeltBadge beltId={student.beltId} />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "active"
                              ? "default"
                              : student.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {student.status === "active"
                            ? "Ativo"
                            : student.status === "pending"
                            ? "Pendente"
                            : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {student.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(student.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingStudent(student);
                            setForm({
                              name: student.name,
                              email: student.email,
                              phone: student.phone || "",
                              birthDate: student.birthDate || "",
                              beltId: student.beltId,
                              location: student.location,
                              status: student.status,
                            });
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <AlertDialog open={deleteId === student.id} onOpenChange={(open) => {
                          if (!open) setDeleteId(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteId(student.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover aluno</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este aluno? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(student.id)}>
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>Atualize os dados do aluno</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-student-name">Nome</Label>
              <Input
                id="edit-student-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-student-email">Email</Label>
              <Input
                id="edit-student-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-student-phone">Telefone</Label>
              <Input
                id="edit-student-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-student-birthdate">Data de Nascimento</Label>
              <Input
                id="edit-student-birthdate"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-student-belt">Faixa</Label>
              <BeltSelect
                value={form.beltId}
                onValueChange={(value) => setForm({ ...form, beltId: value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-student-location">Local</Label>
              <Input
                id="edit-student-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Local de treinamento"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingStudent(null);
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

export default StudentManager;
