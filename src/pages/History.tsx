import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
import { SEO } from "@/components/SEO";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import HERO_IMAGE from "@/assets/images/hero/HistoryCover.webp";

const History = () => {
  const timeline = [
    {
      year: "Início",
      title: "Sua História",
      description: "Conte como tudo começou. Datas importantes, fundadores e a motivação inicial do seu projeto."
    },
    {
      year: "Evolução",
      title: "Seus Marcos",
      description: "Destaque momentos de crescimento, mudanças importantes e conquistas da sua trajetória."
    },
    {
      year: "Hoje",
      title: "Seu Momento",
      description: "Mostre sua estrutura atual, metodologia e o que torna seu dojo ou negócio único."
    },
    {
      year: "Futuro",
      title: "Sua Visão",
      description: "Compartilhe seus objetivos e onde você quer chegar, inspirando alunos e parceiros."
    }
  ];
  
  return <div className="min-h-screen pt-20">
      <SEO
        title="Sobre o Projeto - Dojo Dash Portal"
        description="Conheça o Dojo Dash Portal, a solução completa para gestão de artes marciais."
        keywords="gestão dojo, sistema karate, artes marciais, software dojo"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero" aria-labelledby="history-hero">
        <div
          className="absolute inset-0 bg-cover opacity-20 bg-fixed bg-[center_-25rem]"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Sobre o Projeto
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Uma solução moderna e eficiente para a gestão do seu Dojo.
          </p>
        </div>
    </section>
    <AnimatedDivider />

      {/* Project Description Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            A Plataforma
          </h2>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p>
              O <strong className="text-primary">Dojo Dash Portal</strong> um projeto criado para demonstrar as capacidades desta plataforma de gerenciamento.
              Desenvolvido pelo time <strong className="text-primary">Maneki Neeko</strong>, com o objetivo de fornecer uma plataforma completa para gestão do seu dojo em um preço acessível.
            </p>

            <div className="bg-secondary/50 border-l-4 border-primary p-6 my-8 rounded-r">
              <p className="text-lg font-semibold text-foreground mb-2">
                “Tecnologia e tradição caminhando juntas para a evolução do seu negócio.”
              </p>
            </div>

            <p>
            Tudo que você está lendo pode ser editado e alterado a seu gosto.
            Incluindo também cores, layout, conteúdo, imagens, e etc.
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
            Exiba sua linha do tempo, ou oque mais desejar.
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
            Mostre seu sistema de graduação
          </h2>
          <BeltGrades />
        </div>
      </section>
      <AnimatedDivider />
  </div>;
};
export default History;
