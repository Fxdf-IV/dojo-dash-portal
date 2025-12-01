import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
import { SEO } from "@/components/SEO";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import HERO_IMAGE from "@/assets/images/hero/HistoryCover.webp";

const History = () => {
  const timeline = [
    {
      year: "2010",
      title: "Fundação",
      description: "O Dojo Exemplo foi fundado com o objetivo de promover a saúde e a disciplina através das artes marciais."
    },
    {
      year: "2015",
      title: "Expansão",
      description: "Inauguração da segunda unidade e início das turmas infantis."
    },
    {
      year: "2020",
      title: "Reconhecimento",
      description: "Prêmio de melhor escola de artes marciais da região."
    },
    {
      year: "2024",
      title: "Nova Era",
      description: "Implementação de novas metodologias e modernização das instalações."
    }
  ];
  
  return <div className="min-h-screen pt-20">
      <SEO
        title="História - Dojo Exemplo"
        description="Conheça a história do Dojo Exemplo. Uma jornada dedicada à tradição e formação de caráter."
        keywords="história karate, dojo exemplo, artes marciais"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero" aria-labelledby="history-hero">
        <div
          className="absolute inset-0 bg-cover opacity-20 bg-fixed bg-[center_-25rem]"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Nossa História
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Uma jornada dedicada à excelência e ao desenvolvimento humano.
          </p>
        </div>
    </section>
    <AnimatedDivider />

      {/* History of Life and Dojo Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Sobre o Dojo
          </h2>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p>
              O <strong className="text-primary">Dojo Exemplo</strong> é uma instituição fictícia criada para demonstrar as capacidades desta plataforma de gerenciamento.
              Nossa missão (fictícia) é transformar vidas através do esporte.
            </p>

            <div className="bg-secondary/50 border-l-4 border-primary p-6 my-8 rounded-r">
              <p className="text-lg font-semibold text-foreground mb-2">
                “A disciplina é a ponte entre metas e realizações.”
              </p>
              <p className="text-sm text-muted-foreground text-white">
                — Citação Exemplo
              </p>
            </div>

            <p>
              Nossas instalações contam com equipamentos modernos e um ambiente acolhedor para alunos de todas as idades.
              Oferecemos aulas de Karatê, Kobudo e Defesa Pessoal.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 border-t border-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 bg-fixed"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center text-primary-foreground mb-16 animate-fade-in">
            Linha do Tempo
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {timeline.map((event, index) => <Card key={index} className="border-primary/20 hover:border-primary transition-all hover:shadow-glow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-2xl font-bold text-primary">{event.year}</span>
                        <h3 className="text-xl font-bold text-card-foreground">{event.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
    </section>
    <AnimatedDivider />
    
      {/* Belt Grades Section */}
      <section className="py-20 border-primary bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-20 max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Sistema de Graduação
          </h2>
          <BeltGrades />
        </div>
      </section>
      <AnimatedDivider />
  </div>;
};
export default History;
