import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, MapPin, User2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  studentsService,
  materialsService,
  locationsService,
  senseisService,
  eventsService,
} from "@/services";
import type { Student, Material, Location, Sensei, Event } from "@/types";
import { StudentManager } from "@/components/admin/students/StudentManager";
import { MaterialManager } from "@/components/admin/materials/MaterialManager";
import { LocationManager } from "@/components/admin/locations/LocationManager";
import { SenseiManager } from "@/components/admin/senseis/SenseiManager";
import { EventManager } from "@/components/admin/events/EventManager";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // States para cada recurso
  const [students, setStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [senseis, setSenseis] = useState<Sensei[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Estados de carregamento
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingSenseis, setLoadingSenseis] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch functions
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const data = await studentsService.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos",
        variant: "destructive",
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const data = await materialsService.getAll();
      setMaterials(data);
    } catch (error) {
      console.error("Erro ao carregar materiais:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar materiais",
        variant: "destructive",
      });
    } finally {
      setLoadingMaterials(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const data = await locationsService.getAll();
      setLocations(data);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar locais",
        variant: "destructive",
      });
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchSenseis = async () => {
    try {
      setLoadingSenseis(true);
      const data = await senseisService.getAll();
      setSenseis(data);
    } catch (error) {
      console.error("Erro ao carregar senseis:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar senseis",
        variant: "destructive",
      });
    } finally {
      setLoadingSenseis(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar eventos",
        variant: "destructive",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([
        fetchStudents(),
        fetchMaterials(),
        fetchLocations(),
        fetchSenseis(),
        fetchEvents(),
      ]);
    };
    loadAll();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie alunos, materiais, locais, senseis e eventos
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Alunos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Materiais</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Locais</span>
            </TabsTrigger>
            <TabsTrigger value="senseis" className="flex items-center gap-2">
              <User2 className="w-4 h-4" />
              <span className="hidden sm:inline">Senseis</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <StudentManager
              students={students}
              loading={loadingStudents}
              userId={user.id}
              onUpdate={setStudents}
            />
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <MaterialManager
              materials={materials}
              loading={loadingMaterials}
              onUpdate={setMaterials}
            />
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <LocationManager
              locations={locations}
              loading={loadingLocations}
              onUpdate={setLocations}
            />
          </TabsContent>

          <TabsContent value="senseis" className="mt-6">
            <SenseiManager
              senseis={senseis}
              loading={loadingSenseis}
              onUpdate={setSenseis}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventManager
              events={events}
              loading={loadingEvents}
              onUpdate={setEvents}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
