import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Video, FileText, Trophy } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
import BeltBadge from "@/components/BeltBadge";

const StudentDashboard = () => {
  const { user } = useAuth();

  // Mock materials data - would come from backend based on user's kyu
  const materials = {
    kihons: [
      { id: 1, title: "Gedan Barai", description: "Bloco baixo com o braço de fora para dentro", videoUrl: "#" },
      { id: 2, title: "Age Uke", description: "Bloco alto com o antebraço", videoUrl: "#" },
    ],
    katas: [
      { id: 1, title: "Heian Shodan", description: "Primeiro kata básico com 21 movimentos", videoUrl: "#", imageUrl: "#" },
      { id: 2, title: "Heian Nidan", description: "Segundo kata básico com 26 movimentos", videoUrl: "#", imageUrl: "#" },
    ],
    theory: [
      { id: 1, title: "Etiqueta do Dojo", description: "Regras de comportamento no dojo", content: "..." },
      { id: 2, title: "Terminologia Básica", description: "Principais termos usados no karatê", content: "..." },
    ],
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
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
            {user?.kyu !== undefined && (
              <BeltBadge kyu={user.kyu} className="text-lg px-6 py-3" />
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="kihons" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kihons">
              <BookOpen className="w-4 h-4 mr-2" />
              Kihons
            </TabsTrigger>
            <TabsTrigger value="katas">
              <Video className="w-4 h-4 mr-2" />
              Katas
            </TabsTrigger>
            <TabsTrigger value="theory">
              <FileText className="w-4 h-4 mr-2" />
              Teoria
            </TabsTrigger>
          </TabsList>

          {/* Kihons Tab */}
          <TabsContent value="kihons" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials.kihons.map((kihon) => (
                <Card key={kihon.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {kihon.title}
                    </CardTitle>
                    <CardDescription>{kihon.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted/50 rounded flex items-center justify-center mb-4">
                      <Video className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vídeo e detalhes em breve
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Katas Tab */}
          <TabsContent value="katas" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials.katas.map((kata) => (
                <Card key={kata.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      {kata.title}
                    </CardTitle>
                    <CardDescription>{kata.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted/50 rounded flex items-center justify-center mb-4">
                      <Video className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vídeo, imagens e explicações em breve
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials.theory.map((item) => (
                <Card key={item.id} className="border-primary/20 hover:border-primary transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Conteúdo teórico será disponibilizado em breve
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default StudentDashboard;

