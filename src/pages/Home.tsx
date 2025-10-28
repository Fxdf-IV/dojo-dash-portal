import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Heart, Users, Trophy, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import ctMaylsonImage from "@/assets/ct-maylson-campos-new.jpg";
import bolaCidadaniaImage from "@/assets/bola-cidadania.jpg";
import gotaVerdeImage from "@/assets/gota-verde.jpg";
import colegioExpoenteImage from "@/assets/colegio-expoente.jpg";
import senseiAlessandroImage from "@/assets/sensei-alessandro.jpg";
import senseiMariaImage from "@/assets/sensei-maria.jpg";
import senseiCarlosImage from "@/assets/sensei-carlos.jpg";
import logo from "@/assets/logo.png";
const Home = () => {
  const senseis = [{
    name: "Sensei Alessandro",
    rank: "5º Dan - Faixa Preta",
    image: senseiAlessandroImage,
    description: "Fundador do Alessandro Karatê Dojo, com mais de 25 anos de experiência no Shorin-Ryu. Dedicado à formação técnica e filosófica dos alunos, mantendo viva a tradição do karatê de Okinawa."
  }, {
    name: "Sensei Milena",
    rank: "2º Dan - Faixa Preta",
    image: senseiMariaImage,
    description: "Especialista em kata e bunkai, responsável pelo desenvolvimento técnico dos alunos. Referência em competições regionais e instrutora do projeto Bola e Cidadania."
  }, {
    name: "Sensei Vinicius",
    rank: "1º Dan - Faixa Preta",
    image: senseiCarlosImage,
    description: "Instrutor focado no trabalho com crianças e adolescentes. Coordena as atividades no Colégio Expoente e no Projeto Gota Verde, unindo disciplina marcial e consciência ambiental."
  }];
  const projects = [{
    name: "CT Maylson Campos",
    description: "Centro de Treinamento com infraestrutura completa para o desenvolvimento dos atletas.",
    students: "45+ alunos"
  }, {
    name: "Bola e Cidadania",
    description: "Projeto social que une esporte e educação para transformar vidas.",
    students: "60+ alunos"
  }, {
    name: "Projeto Gota Verde",
    description: "Iniciativa de sustentabilidade aliada ao karatê tradicional.",
    students: "30+ alunos"
  }, {
    name: "Colégio Expoente",
    description: "Parceria educacional levando o karatê para o ambiente escolar.",
    students: "50+ alunos"
  }];
  const values = [{
    icon: Shield,
    title: "Disciplina",
    description: "A base do karatê tradicional e formação de caráter"
  }, {
    icon: Heart,
    title: "Respeito",
    description: "Honra aos mestres, colegas e à tradição milenar"
  }, {
    icon: Users,
    title: "Comunidade",
    description: "Formando cidadãos comprometidos com a sociedade"
  }, {
    icon: Trophy,
    title: "Excelência",
    description: "Busca contínua pela perfeição técnica e pessoal"
  }];
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <img src={logo} alt="Alessandro Karatê Dojo" className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 animate-fade-in" />
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Alessandro Karatê Dojo
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">Tradição Shorin-Ryu</p>
          <p className="text-lg text-primary-foreground/80 mb-12 max-w-3xl mx-auto">
            Mais que um dojo, uma família dedicada à formação integral através do karatê tradicional. 
            Disciplina, respeito e excelência em cada treino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contato">
              <Button size="lg" className="shadow-glow text-lg px-8">
                Quero Começar
              </Button>
            </Link>
            <a href="#projetos">
              <Button size="lg" variant="outline" className="shadow-glow text-lg px-8">
                Conheça Nossos Projetos
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Senseis Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Senseis
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Profissionais dedicados a transmitir a tradição e os valores do karatê Shorin-Ryu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {senseis.map((sensei, index) => <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow overflow-hidden group">
                <div className="aspect-square overflow-hidden bg-muted/50 flex items-center justify-center">
                  {/* Espaço reservado para foto do sensei */}
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-1 text-card-foreground group-hover:text-primary transition-colors">
                    {sensei.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4 text-sm">
                    {sensei.rank}
                  </p>
                  
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-background py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Os pilares que sustentam nossa filosofia e guiam cada aluno em sua jornada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow">
                <CardContent className="p-6 text-center">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Locais de Treino
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça cada um dos espaços onde levamos o karatê tradicional para a comunidade
            </p>
          </div>

          <Tabs defaultValue="ct-maylson" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="ct-maylson">CT Maylson Campos</TabsTrigger>
              <TabsTrigger value="bola-cidadania">Bola e Cidadania</TabsTrigger>
              <TabsTrigger value="gota-verde">Projeto Gota Verde</TabsTrigger>
              <TabsTrigger value="colegio">Colégio Expoente</TabsTrigger>
            </TabsList>

            <TabsContent value="ct-maylson" className="animate-fade-in">
              <Card className="border-primary/20 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={ctMaylsonImage} alt="CT Maylson Campos - Interior do dojo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold text-card-foreground">CT Maylson Campos</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">Nosso centro de treinamento principal oferece infraestrutura completa para o desenvolvimento dos praticantes. Com tatames de alta qualidade, ambiente arejado e equipamentos modernos, o CT Maylson Campos é o coração do Alessandro Karatê Dojo. Aqui, mantemos viva a tradição do Shorin-Ryu com treinos regulares para todas as faixas e idades.</p>
                  
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bola-cidadania" className="animate-fade-in">
              <Card className="border-primary/20 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={bolaCidadaniaImage} alt="Projeto Bola e Cidadania" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold text-card-foreground">Bola e Cidadania</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Um projeto social que transforma vidas através do esporte e da educação. O Bola e Cidadania leva os 
                    ensinamentos do karatê tradicional para comunidades, promovendo inclusão social, disciplina e valores 
                    morais. Mais do que técnicas de luta, ensinamos respeito, cidadania e trabalho em equipe. Um espaço 
                    onde crianças e jovens encontram propósito e desenvolvem seu potencial.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Users className="w-4 h-4" />
                    <span>60+ alunos ativos</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gota-verde" className="animate-fade-in">
              <Card className="border-primary/20 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={gotaVerdeImage} alt="Projeto Gota Verde" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold text-card-foreground">Projeto Gota Verde</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Uma iniciativa única que une o karatê tradicional à consciência ambiental e sustentabilidade. 
                    No Projeto Gota Verde, praticamos em harmonia com a natureza, realizando treinos ao ar livre e 
                    promovendo ações de preservação ambiental. Os alunos aprendem que o respeito ensinado no dojo 
                    se estende ao planeta, desenvolvendo uma consciência ecológica aliada aos valores marciais.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Users className="w-4 h-4" />
                    <span>30+ alunos ativos</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colegio" className="animate-fade-in">
              <Card className="border-primary/20 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={colegioExpoenteImage} alt="Colégio Expoente" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-bold text-card-foreground">Colégio Expoente</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Parceria educacional que integra o karatê ao ambiente escolar, proporcionando aos alunos do Colégio 
                    Expoente uma formação completa que une corpo e mente. Durante as aulas, os estudantes desenvolvem 
                    disciplina, concentração e autocontrole - qualidades que se refletem no desempenho acadêmico. 
                    Uma oportunidade para vivenciar os valores do karatê tradicional dentro do contexto educacional.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Users className="w-4 h-4" />
                    <span>50+ alunos ativos</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="py-20 bg-gradient-to-br from-background py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Projetos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Levando o karatê tradicional para diferentes comunidades de Palmital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, index) => <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-card overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-secondary to-accent" />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597408-26bc8e548a46?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Pronto para Começar sua Jornada?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Junte-se a nós e descubra o verdadeiro espírito do karatê tradicional
          </p>
          <Link to="/contato">
            <Button size="lg" variant="outline" className="shadow-glow text-lg px-8">
              Entre em Contato
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};
export default Home;
