import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Users, BookOpen, MapPin, Image as ImageIcon, Plus, Edit, Images, Trash2, Pencil } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
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

type Student = { id: number; name: string; email: string; kyu: number; location: string; status: "active" | "pending" };
type LocationItem = { id: number; name: string; description: string; imageCount: number; images?: string[] };
type Material = { id: number; title: string; type: "kihon" | "kata" | "theory"; description?: string; videoUrl?: string; imageUrl?: string; minGrade?: string };
type Sensei = { id: number; name: string; rank: string; description: string; imageUrl?: string };

const AdminDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "João Silva", email: "joao@email.com", kyu: 6, location: "CT Maylson Campos", status: "active" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", kyu: 4, location: "Bola e Cidadania", status: "active" },
    { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", kyu: 8, location: "Projeto Gota Verde", status: "pending" },
  ]);

  const [locations, setLocations] = useState<LocationItem[]>([
    { id: 1, name: "CT Maylson Campos", description: "Centro de treinamento principal", imageCount: 3, images: [
      "https://images.unsplash.com/photo-1517637633369-e4cc28755e09?w=800",
      "https://images.unsplash.com/photo-1548786811-c5cb3e0b3e6f?w=800",
      "https://images.unsplash.com/photo-1526404079162-87b4fb2b2ab6?w=800",
    ] },
    { id: 2, name: "Bola e Cidadania", description: "Projeto social", imageCount: 3, images: [
      "https://images.unsplash.com/photo-1517637633369-e4cc28755e09?w=800",
      "https://images.unsplash.com/photo-1548786811-c5cb3e0b3e6f?w=800",
      "https://images.unsplash.com/photo-1526404079162-87b4fb2b2ab6?w=800",
    ] },
  ]);

  // Students state for dialogs
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState<Omit<Student, "id">>({ name: "", email: "", kyu: 0, location: "", status: "active" });

  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const materialsByType = useMemo(() => ({
    kihon: materials.filter(m => m.type === "kihon"),
    kata: materials.filter(m => m.type === "kata"),
    theory: materials.filter(m => m.type === "theory"),
  }), [materials]);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialForm, setMaterialForm] = useState<Omit<Material, "id">>({ title: "", type: "kihon", description: "", videoUrl: "", imageUrl: "", minGrade: "" });


  // Locations state for dialogs
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", description: "", imageUrl: "" });
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [photosLocation, setPhotosLocation] = useState<LocationItem | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  // Senseis state (persist to localStorage so Home can read)
  const [senseis, setSenseis] = useState<Sensei[]>([]);
  const [isAddSenseiOpen, setIsAddSenseiOpen] = useState(false);
  const [isEditSenseiOpen, setIsEditSenseiOpen] = useState(false);
  const [editingSensei, setEditingSensei] = useState<Sensei | null>(null);
  const [senseiForm, setSenseiForm] = useState<Omit<Sensei, "id">>({ name: "", rank: "black-1", description: "", imageUrl: "" });

  useEffect(() => {
    const stored = localStorage.getItem("senseis");
    if (stored) {
      try {
        setSenseis(JSON.parse(stored));
      } catch {
        // ignore
      }
    } else {
      // seed with defaults similar to Home if empty
      const defaults: Sensei[] = [
        { id: 1, name: "Sensei Alessandro", rank: "4º Dan - Faixa Preta", description: "Fundador do Alessandro Karatê e Kobudo, com mais de 25 anos de experiência no Shorin-Ryu. Dedicado à formação técnica e filosófica dos alunos, mantendo viva a tradição do karatê de Okinawa.", imageUrl: "" },
        { id: 2, name: "Sensei Milena", rank: "2º Dan - Faixa Preta", description: "Especialista em kata e bunkai, responsável pelo desenvolvimento técnico dos alunos. Referência em competições regionais e instrutora do projeto Bola e Cidadania.", imageUrl: "" },
        { id: 3, name: "Sensei Vinicius", rank: "1º Dan - Faixa Preta", description: "Instrutor focado no trabalho com crianças e adolescentes. Coordena as atividades no Colégio Expoente e no Projeto Gota Verde, unindo disciplina marcial e consciência ambiental.", imageUrl: "" },
      ];
      setSenseis(defaults);
      localStorage.setItem("senseis", JSON.stringify(defaults));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("senseis", JSON.stringify(senseis));
  }, [senseis]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-primary-foreground/90">
            Gerencie alunos, conteúdos e locais
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">
              <Users className="w-4 h-4 mr-2" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="materials">
              <BookOpen className="w-4 h-4 mr-2" />
              Materiais
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="w-4 h-4 mr-2" />
              Locais
            </TabsTrigger>
            <TabsTrigger value="senseis">
              <Images className="w-4 h-4 mr-2" />
              Senseis
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Alunos</CardTitle>
                    <CardDescription>Visualize e edite informações dos alunos</CardDescription>
                  </div>
                  <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Aluno
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Aluno</DialogTitle>
                        <DialogDescription>Preencha os dados do aluno</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="student-name">Nome</Label>
                          <Input id="student-name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="student-email">Email</Label>
                          <Input id="student-email" type="email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="student-kyu">Faixa (kyu)</Label>
                          <Input id="student-kyu" type="number" value={studentForm.kyu} onChange={(e) => setStudentForm({ ...studentForm, kyu: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label htmlFor="student-location">Local</Label>
                          <Input id="student-location" value={studentForm.location} onChange={(e) => setStudentForm({ ...studentForm, location: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancelar</Button>
                          <Button onClick={() => {
                            const nextId = Math.max(0, ...students.map(s => s.id)) + 1;
                            setStudents([...students, { id: nextId, ...studentForm }]);
                            setIsAddStudentOpen(false);
                            setStudentForm({ name: "", email: "", kyu: 0, location: "", status: "active" });
                          }}>Adicionar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Faixa</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <BeltBadge kyu={student.kyu} />
                        </TableCell>
                        <TableCell>{student.location}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Ativo" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog open={isEditStudentOpen && editingStudent?.id === student.id} onOpenChange={(open) => {
                            if (!open) { setIsEditStudentOpen(false); setEditingStudent(null); }
                          }}>
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditingStudent(student);
                              setStudentForm({ name: student.name, email: student.email, kyu: student.kyu, location: student.location, status: student.status });
                              setIsEditStudentOpen(true);
                            }}>
                              Editar
                            </Button>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Aluno</DialogTitle>
                                <DialogDescription>Atualize os dados do aluno</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-2">
                                <div>
                                  <Label htmlFor={`student-name-${student.id}`}>Nome</Label>
                                  <Input id={`student-name-${student.id}`} value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                                </div>
                                <div>
                                  <Label htmlFor={`student-email-${student.id}`}>Email</Label>
                                  <Input id={`student-email-${student.id}`} type="email" value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} />
                                </div>
                                <div>
                                  <Label htmlFor={`student-kyu-${student.id}`}>Faixa (kyu)</Label>
                                  <Input id={`student-kyu-${student.id}`} type="number" value={studentForm.kyu} onChange={(e) => setStudentForm({ ...studentForm, kyu: Number(e.target.value) })} />
                                </div>
                                <div>
                                  <Label htmlFor={`student-location-${student.id}`}>Local</Label>
                                  <Input id={`student-location-${student.id}`} value={studentForm.location} onChange={(e) => setStudentForm({ ...studentForm, location: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => { setIsEditStudentOpen(false); setEditingStudent(null); }}>Cancelar</Button>
                                  <Button onClick={() => {
                                    if (!editingStudent) return;
                                    setStudents(students.map(s => s.id === editingStudent.id ? { ...editingStudent, ...studentForm } : s));
                                    setIsEditStudentOpen(false);
                                    setEditingStudent(null);
                                  }}>Salvar</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Materiais</CardTitle>
                    <CardDescription>Adicione e edite conteúdos para os alunos</CardDescription>
                  </div>
                  <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Material
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Material</DialogTitle>
                        <DialogDescription>Preencha os dados do material</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="material-title">Título</Label>
                          <Input id="material-title" value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="material-type">Tipo</Label>
                          <select id="material-type" className="w-full border rounded px-3 py-2" value={materialForm.type} onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value as Material["type"] })}>
                            <option value="kihon">Kihon</option>
                            <option value="kata">Kata</option>
                            <option value="theory">Teoria</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="material-desc">Descrição</Label>
                          <Textarea id="material-desc" value={materialForm.description} onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })} rows={3} />
                        </div>
                        <div>
                          <Label htmlFor="material-video">URL do Vídeo</Label>
                          <Input id="material-video" type="url" value={materialForm.videoUrl} onChange={(e) => setMaterialForm({ ...materialForm, videoUrl: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="material-image">URL da Imagem</Label>
                          <Input id="material-image" type="url" value={materialForm.imageUrl} onChange={(e) => setMaterialForm({ ...materialForm, imageUrl: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="material-min-grade">Faixa mínima</Label>
                          <BeltSelect
                            value={materialForm.minGrade}
                            onValueChange={(value) => setMaterialForm({ ...materialForm, minGrade: value })}
                            placeholder="Escolha a graduação mínima"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddMaterialOpen(false)}>Cancelar</Button>
                          <Button onClick={() => {
                            const nextId = Math.max(0, ...materials.map(m => m.id)) + 1;
                            setMaterials([...materials, { id: nextId, ...materialForm }]);
                            setIsAddMaterialOpen(false);
                            setMaterialForm({ title: "", type: "kihon", description: "", videoUrl: "", imageUrl: "", minGrade: "" });
                          }}>Adicionar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Kihons</CardTitle>
                      <CardDescription>{materialsByType.kihon.length} materiais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MaterialsManager title="Kihons" items={materialsByType.kihon} onEdit={(m) => setEditingMaterial(m)} onDelete={(id) => setMaterials(materials.filter(m => m.id !== id))} />
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Katas</CardTitle>
                      <CardDescription>{materialsByType.kata.length} materiais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MaterialsManager title="Katas" items={materialsByType.kata} onEdit={(m) => setEditingMaterial(m)} onDelete={(id) => setMaterials(materials.filter(m => m.id !== id))} />
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Teoria</CardTitle>
                      <CardDescription>{materialsByType.theory.length} materiais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MaterialsManager title="Teoria" items={materialsByType.theory} onEdit={(m) => setEditingMaterial(m)} onDelete={(id) => setMaterials(materials.filter(m => m.id !== id))} />
                    </CardContent>
                  </Card>
                </div>
                {/* Edit material dialog */}
                {editingMaterial && (
                  <Dialog open={!!editingMaterial} onOpenChange={(open) => { if (!open) setEditingMaterial(null); }}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Material</DialogTitle>
                        <DialogDescription>Atualize os dados do material</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="material-title-edit">Título</Label>
                          <Input id="material-title-edit" value={editingMaterial.title} onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="material-desc-edit">Descrição</Label>
                          <Textarea id="material-desc-edit" value={editingMaterial.description ?? ""} onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })} rows={3} />
                        </div>
                        <div>
                          <Label htmlFor="material-video-edit">URL do Vídeo</Label>
                          <Input id="material-video-edit" type="url" value={editingMaterial.videoUrl ?? ""} onChange={(e) => setEditingMaterial({ ...editingMaterial, videoUrl: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="material-image-edit">URL da Imagem</Label>
                          <Input id="material-image-edit" type="url" value={editingMaterial.imageUrl ?? ""} onChange={(e) => setEditingMaterial({ ...editingMaterial, imageUrl: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="material-min-grade-edit">Faixa mínima</Label>
                          <BeltSelect
                            value={editingMaterial.minGrade ?? ""}
                            onValueChange={(value) => setEditingMaterial({ ...editingMaterial, minGrade: value })}
                            placeholder="Escolha a graduação mínima"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingMaterial(null)}>Cancelar</Button>
                          <Button onClick={() => {
                            setMaterials(materials.map(m => m.id === editingMaterial.id ? editingMaterial : m));
                            setEditingMaterial(null);
                          }}>Salvar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Locais</CardTitle>
                    <CardDescription>Adicione e edite informações dos locais de treino</CardDescription>
                  </div>
                  <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Local
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Local</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do local de treinamento
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="location-name">Nome do Local</Label>
                          <Input 
                            id="location-name" 
                            value={newLocation.name}
                            onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                            placeholder="Ex: CT Maylson Campos"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location-description">Descrição</Label>
                          <Textarea 
                            id="location-description"
                            value={newLocation.description}
                            onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                            placeholder="Descreva o local..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location-image">URL da Foto de Capa</Label>
                          <Input 
                            id="location-image"
                            type="url"
                            value={newLocation.imageUrl}
                            onChange={(e) => setNewLocation({...newLocation, imageUrl: e.target.value})}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={() => {
                            // TODO: Add to locations list
                            console.log("Adding location:", newLocation);
                            setIsAddLocationOpen(false);
                            setNewLocation({ name: "", description: "", imageUrl: "" });
                          }}>
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {locations.map((location) => (
                    <Card key={location.id} className="border-primary/20">
                      <CardHeader>
                        <CardTitle>{location.name}</CardTitle>
                        <CardDescription>{location.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="w-4 h-4" />
                            {location.imageCount} fotos
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => {
                              setEditingLocation(location);
                              setIsEditLocationOpen(true);
                            }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => { setPhotosLocation(location); setIsPhotosOpen(true); }}>
                              Ver Fotos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* Edit Location Dialog */}
                <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Local</DialogTitle>
                      <DialogDescription>Atualize as informações do local</DialogDescription>
                    </DialogHeader>
                    {editingLocation && (
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="edit-location-name">Nome</Label>
                          <Input id="edit-location-name" value={editingLocation.name} onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="edit-location-desc">Descrição</Label>
                          <Textarea id="edit-location-desc" value={editingLocation.description} onChange={(e) => setEditingLocation({ ...editingLocation, description: e.target.value })} rows={3} />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditLocationOpen(false)}>Cancelar</Button>
                          <Button onClick={() => {
                            setLocations(locations.map(l => l.id === editingLocation.id ? { ...editingLocation } : l));
                            setIsEditLocationOpen(false);
                          }}>Salvar</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                {/* Photos Viewer Dialog */}
                <Dialog open={isPhotosOpen} onOpenChange={setIsPhotosOpen}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Fotos {photosLocation ? `- ${photosLocation.name}` : ""}</DialogTitle>
                      <DialogDescription>Visualize e gerencie as fotos do local</DialogDescription>
                    </DialogHeader>
                    {photosLocation && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(photosLocation.images ?? []).map((img, idx) => (
                            <div key={idx} className="relative group border rounded overflow-hidden">
                              <img src={img} alt="Foto do local" className="w-full h-40 object-cover" />
                              <button className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded p-1" onClick={() => {
                                const updated = { ...photosLocation, images: (photosLocation.images ?? []).filter((_, i) => i !== idx), imageCount: Math.max(0, (photosLocation.imageCount ?? 0) - 1) };
                                setLocations(locations.map(l => l.id === updated.id ? updated : l));
                                setPhotosLocation(updated);
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label htmlFor="new-photo-url">Adicionar foto (URL)</Label>
                            <Input id="new-photo-url" placeholder="https://..." value={newPhotoUrl} onChange={(e) => setNewPhotoUrl(e.target.value)} />
                          </div>
                          <Button onClick={() => {
                            if (!photosLocation || !newPhotoUrl) return;
                            const updated = { ...photosLocation, images: [...(photosLocation.images ?? []), newPhotoUrl], imageCount: (photosLocation.imageCount ?? 0) + 1 };
                            setLocations(locations.map(l => l.id === updated.id ? updated : l));
                            setPhotosLocation(updated);
                            setNewPhotoUrl("");
                          }}>Adicionar</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Senseis Tab */}
          <TabsContent value="senseis" className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gerenciar Senseis</CardTitle>
                    <CardDescription>Adicione, edite ou remova os senseis exibidos na página inicial</CardDescription>
                  </div>
                  <Dialog open={isAddSenseiOpen} onOpenChange={setIsAddSenseiOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Sensei
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Sensei</DialogTitle>
                        <DialogDescription>Preencha os dados do sensei</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="sensei-name">Nome</Label>
                          <Input id="sensei-name" value={senseiForm.name} onChange={(e) => setSenseiForm({ ...senseiForm, name: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="sensei-rank">Graduação</Label>
                          <BeltSelect
                            value={senseiForm.rank}
                            onValueChange={(value) => setSenseiForm({ ...senseiForm, rank: value })}
                            placeholder="Escolha a graduação"
                            onlyDan={true}
                          />
                        </div>
                        <div>
                          <Label htmlFor="sensei-desc">Descrição</Label>
                          <Textarea id="sensei-desc" rows={3} value={senseiForm.description} onChange={(e) => setSenseiForm({ ...senseiForm, description: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="sensei-image">URL da Foto</Label>
                          <Input id="sensei-image" type="url" value={senseiForm.imageUrl} onChange={(e) => setSenseiForm({ ...senseiForm, imageUrl: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddSenseiOpen(false)}>Cancelar</Button>
                          <Button onClick={() => {
                            const nextId = Math.max(0, ...senseis.map(s => s.id)) + 1;
                            setSenseis([...senseis, { id: nextId, ...senseiForm }]);
                            setSenseiForm({ name: "", rank: "", description: "", imageUrl: "" });
                            setIsAddSenseiOpen(false);
                          }}>Adicionar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {senseis.map((s) => (
                    <Card key={s.id} className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{s.name}</span>
                        </CardTitle>
                        <CardDescription>
                          {BELT_GRADES.find(belt => belt.id === s.rank)?.name || s.rank}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{s.description}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => { setEditingSensei(s); setSenseiForm({ name: s.name, rank: s.rank, description: s.description, imageUrl: s.imageUrl }); setIsEditSenseiOpen(true); }}>
                              <Pencil className="w-4 h-4 mr-2" /> Editar
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => setSenseis(senseis.filter(x => x.id !== s.id))}>
                              <Trash2 className="w-4 h-4 mr-2" /> Remover
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Dialog open={isEditSenseiOpen} onOpenChange={setIsEditSenseiOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Sensei</DialogTitle>
                      <DialogDescription>Atualize os dados do sensei</DialogDescription>
                    </DialogHeader>
                    {editingSensei && (
                      <div className="space-y-4 py-2">
                        <div>
                          <Label htmlFor="sensei-name-edit">Nome</Label>
                          <Input id="sensei-name-edit" value={senseiForm.name} onChange={(e) => setSenseiForm({ ...senseiForm, name: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="sensei-rank-edit">Graduação</Label>
                          <BeltSelect
                            value={senseiForm.rank}
                            onValueChange={(value) => setSenseiForm({ ...senseiForm, rank: value })}
                            placeholder="Escolha a graduação"
                            onlyDan={true}
                          />
                        </div>
                        <div>
                          <Label htmlFor="sensei-desc-edit">Descrição</Label>
                          <Textarea id="sensei-desc-edit" rows={3} value={senseiForm.description} onChange={(e) => setSenseiForm({ ...senseiForm, description: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="sensei-image-edit">URL da Foto</Label>
                          <Input id="sensei-image-edit" type="url" value={senseiForm.imageUrl} onChange={(e) => setSenseiForm({ ...senseiForm, imageUrl: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditSenseiOpen(false)}>Cancelar</Button>
                          <Button onClick={() => {
                            if (!editingSensei) return;
                            setSenseis(senseis.map(x => x.id === editingSensei.id ? { id: editingSensei.id, ...senseiForm } : x));
                            setIsEditSenseiOpen(false);
                          }}>Salvar</Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default AdminDashboard;

// Lightweight materials manager list component to avoid duplication
function MaterialsManager({ title, items, onEdit, onDelete }: { title: string; items: Material[]; onEdit: (m: Material) => void; onDelete: (id: number) => void }) {
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">Nenhum material em "{title}" ainda.</p>}
      <div className="space-y-2">
        {items.map((m) => (
          <div key={m.id} className="flex items-center justify-between border rounded px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{m.title}</p>
              {m.minGrade && <p className="text-xs text-muted-foreground">Mínimo: {m.minGrade}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(m)}>
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(m.id)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

