import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, MapPin, User2, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  studentsService,
  materialsService,
  locationsService,
  senseisService,
  eventsService,
  usersService,
} from "@/services";
import type { Student, Material, Location, Sensei, Event, User } from "@/types";
import { StudentManager } from "@/components/admin/users/students/StudentManager";
import { MaterialManager } from "@/components/admin/materials/MaterialManager";
import { LocationManager } from "@/components/admin/locations/LocationManager";
import { SenseiManager } from "@/components/admin/senseis/SenseiManager";
import { EventManager } from "@/components/admin/events/EventManager";
import { AdminManager } from "@/components/admin/users/admins/AdminManager";
import { ContactConfigModal } from "@/components/admin/ContactConfigModal";
import { AnimatedDivider } from "@/components/AnimatedDivider";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // States para cada recurso
  const [students, setStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [senseis, setSenseis] = useState<Sensei[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);

  // Estados de carregamento
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingSenseis, setLoadingSenseis] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

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

  const fetchAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const data = await usersService.getAll("admin");
      setAdmins(data);
    } catch (error) {
      console.error("Erro ao carregar administradores:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar administradores",
        variant: "destructive",
      });
    } finally {
      setLoadingAdmins(false);
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
        fetchAdmins(),
      ]);
    };
    loadAll();
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Carregando painel" />
      </div>
    );
  }

  return (
    <><div className="min-h-screen pt-20 bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <section className="bg-gradient-hero border-b border-primary py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-primary-foreground/90">
              Gerencie alunos, materiais, locais, senseis e eventos
            </p>
          </div>
          <ContactConfigModal />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Alunos</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Administradores</span>
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
              onUpdate={setStudents}
              locations={locations} />
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <MaterialManager
              materials={materials}
              loading={loadingMaterials}
              onUpdate={setMaterials} />
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <LocationManager
              locations={locations}
              loading={loadingLocations}
              onUpdate={setLocations} />
          </TabsContent>

          <TabsContent value="senseis" className="mt-6">
            <SenseiManager
              senseis={senseis}
              loading={loadingSenseis}
              onUpdate={setSenseis} />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventManager
              events={events}
              loading={loadingEvents}
              onUpdate={setEvents} />
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <AdminManager
              admins={admins}
              loading={loadingAdmins}
              onUpdate={setAdmins} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
    <AnimatedDivider />
    </>
  );
};

export default AdminDashboard;
