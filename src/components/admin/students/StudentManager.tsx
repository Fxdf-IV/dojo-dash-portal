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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { Student, Location } from "@/types";
import { studentsService } from "@/services";
import { getBeltDisplay } from "@/constants/beltDisplay";

interface StudentManagerProps {
  students: Student[];
  loading: boolean;
  onUpdate: (students: Student[]) => void;
  locations: Location[];
}

export const StudentManager = ({
  students,
  loading,
  onUpdate,
  locations,
}: StudentManagerProps) => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    startDate: "",
    email: "",
    phone: "",
    beltId: "white",
    location: "",
    status: "active" as "active" | "pending" | "inactive",
    password: "",
    confirmPassword: "",
  });

  const locationNames = locations.map((location) => location.name).filter(Boolean);

  const renderBeltBadge = (beltId?: string) => {
    const display = getBeltDisplay(beltId);
    if (!display) {
      return (
        <Badge variant="outline" className="text-xs font-semibold">
          Sem faixa
        </Badge>
      );
    }

    const style = display.background.startsWith("linear-gradient")
      ? { background: display.background }
      : { backgroundColor: display.background };

    return (
      <Badge
        className={`text-xs font-semibold border-none [text-shadow:_1px_1px_6px_rgba(0,0,0,0.6)] ${display.textClass}`}
        style={style}
      >
        {display.label}
      </Badge>
    );
  };

  const renderStatusBadge = (status: Student["status"]) => {
    if (status === "active") {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:hover:text-blue-100">
          Ativo
        </Badge>
      );
    }

    if (status === "pending") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 dark:bg-red-900/50 dark:text-red-100 dark:border-red-800 dark:hover:bg-red-900/50 dark:hover:text-red-100">
          Pendente
        </Badge>
      );
    }

    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-800 dark:bg-red-900/60 dark:text-red-100 dark:border-red-800 dark:hover:bg-red-900/60 dark:hover:text-red-100">
        Inativo
      </Badge>
    );
  };

  const resetForm = () => {
    setForm({
      name: "",
      birthDate: "",
      startDate: "",
      email: "",
      phone: "",
      beltId: "white",
      location: "",
      status: "active",
      password: "",
      confirmPassword: "",
    });
  };

  const handleAdd = async () => {
    if (!form.password || !form.confirmPassword) {
      toast({
        title: "Senha obrigatória",
        description: "Informe e confirme a senha do aluno",
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
      const { confirmPassword, ...payload } = form;
      const newStudent = await studentsService.create({
        ...payload,
        birthDate: form.birthDate || undefined,
        startDate: form.startDate || undefined,
        phone: form.phone || undefined,
      });
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

    if (form.password || form.confirmPassword) {
      if (!form.password || !form.confirmPassword || form.password !== form.confirmPassword) {
        toast({
          title: "Senhas não conferem",
          description: "Preencha ambos os campos de senha com o mesmo valor",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const { confirmPassword, ...payload } = form;
      const dataToSend: typeof payload & { password?: string } = {
        ...payload,
        birthDate: form.birthDate || undefined,
        startDate: form.startDate || undefined,
        phone: form.phone || undefined,
      };

      if (!form.password) {
        delete dataToSend.password;
      }

      const updated = await studentsService.update(editingStudent.id, dataToSend);
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
                    <Label htmlFor="student-startdate">Data de Início</Label>
                    <Input
                      id="student-startdate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
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
                    <Label htmlFor="student-password">Senha</Label>
                    <Input
                      id="student-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-confirm-password">Confirmar Senha</Label>
                    <Input
                      id="student-confirm-password"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-location">Local</Label>
                    <Select
                      value={form.location}
                      onValueChange={(value) => setForm({ ...form, location: value })}
                      disabled={locationNames.length === 0}
                    >
                      <SelectTrigger id="student-location">
                        <SelectValue
                          placeholder={
                            locationNames.length === 0
                              ? "Cadastre um local antes de adicionar alunos"
                              : "Selecione o local"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {locationNames.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                        {form.location && !locationNames.includes(form.location) && (
                          <SelectItem value={form.location}>
                            {form.location}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="student-active"
                      checked={form.status === "active"}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, status: checked ? "active" : "pending" })
                      }
                    />
                    <div>
                      <Label htmlFor="student-active" className="!mt-0">
                        Ativo
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Desmarque para deixar o aluno como pendente
                      </p>
                    </div>
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
                    <TableHead>Local</TableHead>
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
                      <TableCell>{student.location}</TableCell>
                      <TableCell>
                        {renderBeltBadge(student.beltId)}
                      </TableCell>
                      <TableCell>{renderStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {student.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(student.id)}
                            className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 hover:from-green-500 hover:via-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 font-semibold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_2s_ease-in-out_infinite] hover:before:animate-none"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Ativar
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
                              startDate: student.startDate?.slice(0, 10) || "",
                              beltId: student.beltId,
                              location: student.location,
                              status: student.status,
                              password: "",
                              confirmPassword: "",
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
              <Label htmlFor="edit-student-startdate">Data de Início</Label>
              <Input
                id="edit-student-startdate"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
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
              <Label htmlFor="edit-student-password">Senha</Label>
              <Input
                id="edit-student-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Deixe em branco para manter"
              />
            </div>
            <div>
              <Label htmlFor="edit-student-confirm-password">Confirmar Senha</Label>
              <Input
                id="edit-student-confirm-password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Deixe em branco para manter"
              />
            </div>
            <div>
              <Label htmlFor="edit-student-location">Local</Label>
              <Select
                value={form.location}
                onValueChange={(value) => setForm({ ...form, location: value })}
                disabled={locationNames.length === 0}
              >
                <SelectTrigger id="edit-student-location">
                  <SelectValue
                    placeholder={
                      locationNames.length === 0
                        ? "Cadastre um local antes de editar alunos"
                        : "Selecione o local"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {locationNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                  {form.location && !locationNames.includes(form.location) && (
                    <SelectItem value={form.location}>
                      {form.location}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-student-active"
                checked={form.status === "active"}
                onCheckedChange={(checked) =>
                  setForm({ ...form, status: checked ? "active" : "pending" })
                }
              />
              <div>
                <Label htmlFor="edit-student-active" className="!mt-0">
                  Ativo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Desmarque para manter o aluno como pendente
                </p>
              </div>
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
