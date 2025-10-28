import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Users, BookOpen, MapPin, Image as ImageIcon, Plus, Edit } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([
    { id: 1, name: "João Silva", email: "joao@email.com", kyu: 6, location: "CT Maylson Campos", status: "active" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", kyu: 4, location: "Bola e Cidadania", status: "active" },
    { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", kyu: 8, location: "Projeto Gota Verde", status: "pending" },
  ]);

  const [locations, setLocations] = useState([
    { id: 1, name: "CT Maylson Campos", description: "Centro de treinamento principal", imageCount: 3 },
    { id: 2, name: "Bola e Cidadania", description: "Projeto social", imageCount: 3 },
  ]);

  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", description: "", imageUrl: "" });

  return (
    <div className="min-h-screen pt-20 bg-background">
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
            <TabsTrigger value="grades">
              Graduações
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
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Aluno
                  </Button>
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
                        <TableCell>Faixa {student.kyu}</TableCell>
                        <TableCell>{student.location}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Ativo" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
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
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Material
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Kihons</CardTitle>
                      <CardDescription>5 materiais ativos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Gerenciar Kihons
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Katas</CardTitle>
                      <CardDescription>8 materiais ativos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Gerenciar Katas
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Teoria</CardTitle>
                      <CardDescription>12 materiais ativos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Gerenciar Teoria
                      </Button>
                    </CardContent>
                  </Card>
                </div>
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
                            <Button variant="outline" className="flex-1">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Ver Fotos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Graduação</CardTitle>
                <CardDescription>
                  Visualize todas as graduações do karatê
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BeltGrades />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default AdminDashboard;

