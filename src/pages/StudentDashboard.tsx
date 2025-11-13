import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Video, FileText, Trophy, Swords } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
import BeltBadge from "@/components/BeltBadge";
import { BELT_GRADES } from "@/components/BeltSelect";
import { materialsService } from "@/services";
import type { Material } from "@/types";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Helper para verificar se usuário pode acessar material
  const canAccessMaterial = (userBeltId?: string, materialMinBeltId?: string) => {
    if (!materialMinBeltId) return true; // Material sem restrição
    if (!userBeltId) return false; // Usuário sem graduação

    const userBelt = BELT_GRADES.find(b => b.id === userBeltId);
    const minBelt = BELT_GRADES.find(b => b.id === materialMinBeltId);

    if (!userBelt || !minBelt) return false;

    // Dan sempre pode acessar materiais Kyu
    if (userBelt.rank === 'dan' && minBelt.rank === 'kyu') return true;

    // Dan só acessa Dan de nível menor ou igual
    if (userBelt.rank === 'dan' && minBelt.rank === 'dan') {
      return userBelt.level >= minBelt.level;
    }

    // Kyu acessa Kyu de nível maior ou igual (9=branca, 1=marrom)
    if (userBelt.rank === 'kyu' && minBelt.rank === 'kyu') {
      return userBelt.level <= minBelt.level;
    }

    // Kyu não acessa Dan
    return false;
  };

  // Filter materials by user's belt level
  const availableMaterials = {
    kihons: materials.filter(m => m.type === "kihon" && canAccessMaterial(user?.beltId, m.minBeltId)),
    katas: materials.filter(m => m.type === "kata" && canAccessMaterial(user?.beltId, m.minBeltId)),
    theory: materials.filter(m => m.type === "theory" && canAccessMaterial(user?.beltId, m.minBeltId)),
    bunkai: materials.filter(m => m.type === "bunkai" && canAccessMaterial(user?.beltId, m.minBeltId)),
  };



  // Refresh user data on page load
  useEffect(() => {
    const refreshUserOnLoad = async () => {
      if (user && user.role === 'student') {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error);
        }
      }
    };

    refreshUserOnLoad();
  }, []); // Executar apenas uma vez no carregamento da página

  // Load materials from API
  useEffect(() => {
    loadMaterials();
  }, [user?.beltId]);

  const loadMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const data = await materialsService.getAll(); // Removido filtro - feito no frontend
      setMaterials(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar materiais",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingMaterials(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-2">
                Bem-vindo, {user?.name}!
              </h1>
              <p className="text-primary-foreground/90">
                Acesse seus materiais de treinamento
              </p>
            </div>
            {user?.beltId && (
              <BeltBadge beltId={user.beltId} className="text-lg px-6 py-3" />
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="kihons" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kihons">
              <BookOpen className="w-4 h-4 mr-2" />
              Kihons
            </TabsTrigger>
            <TabsTrigger value="katas">
              <Trophy className="w-4 h-4 mr-2" />
              Katas
            </TabsTrigger>
            <TabsTrigger value="theory">
              <FileText className="w-4 h-4 mr-2" />
              Teoria
            </TabsTrigger>
            <TabsTrigger value="bunkai">
              <Swords className="w-4 h-4 mr-2" />
              Bunkai
            </TabsTrigger>
          </TabsList>

          {/* Kihons Tab */}
          <TabsContent value="kihons" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingMaterials ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    Carregando materiais...
                  </CardContent>
                </Card>
              ) : availableMaterials.kihons.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhum kihon disponível para sua graduação atual
                  </CardContent>
                </Card>
              ) : (
                availableMaterials.kihons.map((kihon) => (
                  <Card key={kihon.id} className="border-primary/20 hover:border-primary transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {kihon.title}
                      </CardTitle>
                      <CardDescription>{kihon.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {kihon.content && (
                          <p className="text-sm text-muted-foreground">{kihon.content}</p>
                        )}
                        {kihon.videoUrl ? (
                          <a href={kihon.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                            <Video className="w-4 h-4" />
                            Assistir vídeo
                          </a>
                        ) : (
                          <div className="aspect-video bg-muted/50 rounded flex items-center justify-center">
                            <Video className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Katas Tab */}
          <TabsContent value="katas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingMaterials ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    Carregando materiais...
                  </CardContent>
                </Card>
              ) : availableMaterials.katas.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhum kata disponível para sua graduação atual
                  </CardContent>
                </Card>
              ) : (
                availableMaterials.katas.map((kata) => (
                <Card key={kata.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      {kata.title}
                    </CardTitle>
                    <CardDescription>{kata.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {kata.content && (
                        <p className="text-sm text-muted-foreground">{kata.content}</p>
                      )}
                      <div className="flex gap-4">
                        {kata.videoUrl ? (
                          <a href={kata.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                            <Video className="w-4 h-4" />
                            Assistir vídeo
                          </a>
                        ) : (
                          <div className="aspect-video bg-muted/50 rounded flex items-center justify-center">
                            <Video className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        {kata.imageUrl && (
                          <a href={kata.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                            <FileText className="w-4 h-4" />
                            Ver diagrama
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingMaterials ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    Carregando materiais...
                  </CardContent>
                </Card>
              ) : availableMaterials.theory.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhum material teórico disponível para sua graduação atual
                  </CardContent>
                </Card>
              ) : (
                availableMaterials.theory.map((item) => (
                <Card key={item.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {item.content && (
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        )}
                        {item.imageUrl && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          {item.videoUrl && (
                            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                              <Video className="w-4 h-4" />
                              Assistir Vídeo
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Bunkai Tab */}
          <TabsContent value="bunkai" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingMaterials ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    Carregando materiais...
                  </CardContent>
                </Card>
              ) : availableMaterials.bunkai.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Nenhum bunkai disponível para sua graduação atual
                  </CardContent>
                </Card>
              ) : (
                availableMaterials.bunkai.map((bunkai) => (
                  <Card key={bunkai.id} className="border-primary/20 hover:border-primary transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Swords className="w-5 h-5 text-primary" />
                        {bunkai.title}
                      </CardTitle>
                      <CardDescription>{bunkai.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bunkai.content && (
                          <p className="text-sm text-muted-foreground">{bunkai.content}</p>
                        )}
                        {bunkai.imageUrl && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={bunkai.imageUrl}
                              alt={bunkai.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          {bunkai.videoUrl && (
                            <a href={bunkai.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                              <Video className="w-4 h-4" />
                              Assistir Vídeo
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default StudentDashboard;
