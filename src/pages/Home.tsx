import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const projects = [
    {
      name: "CT Maylson Campos",
      description: "Centro de Treinamento com infraestrutura completa para o desenvolvimento dos atletas.",
      students: "45+ alunos",
    },
    {
      name: "Bola e Cidadania",
      description: "Projeto social que une esporte e educação para transformar vidas.",
      students: "60+ alunos",
    },
    {
      name: "Projeto Gota Verde",
      description: "Iniciativa de sustentabilidade aliada ao karatê tradicional.",
      students: "30+ alunos",
    },
    {
      name: "Colégio Expoente",
      description: "Parceria educacional levando o karatê para o ambiente escolar.",
      students: "50+ alunos",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Disciplina",
      description: "A base do karatê tradicional e formação de caráter",
    },
    {
      icon: Heart,
      title: "Respeito",
      description: "Honra aos mestres, colegas e à tradição milenar",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Formando cidadãos comprometidos com a sociedade",
    },
    {
      icon: Trophy,
      title: "Excelência",
      description: "Busca contínua pela perfeição técnica e pessoal",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Alessandro Karatê Dojo
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Tradição Shorin-Ryu em Palmital-SP
          </p>
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
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-secondary">
                Conheça Nossos Projetos
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
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
            {values.map((value, index) => (
              <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow">
                <CardContent className="p-6 text-center">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="py-20 bg-secondary/50">
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
            {projects.map((project, index) => (
              <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-card overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-secondary to-accent" />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{project.students}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            <Button size="lg" variant="outline" className="shadow-glow text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-secondary">
              Entre em Contato
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
