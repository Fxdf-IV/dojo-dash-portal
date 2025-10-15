import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Historia = () => {
  const timeline = [
    {
      year: "1980s",
      title: "As Raízes",
      description: "A história do dojo começa com o Mestre Alessandro, introduzindo o karatê Shorin-Ryu em Palmital.",
    },
    {
      year: "1995",
      title: "Fundação Oficial",
      description: "Abertura oficial do dojo, marcando o início de uma jornada dedicada ao karatê tradicional.",
    },
    {
      year: "2005",
      title: "Expansão Social",
      description: "Início dos projetos sociais, levando o karatê para comunidades carentes.",
    },
    {
      year: "2015",
      title: "Reconhecimento",
      description: "Conquistas em campeonatos regionais e formação de atletas de destaque.",
    },
    {
      year: "2025",
      title: "Presente",
      description: "Mais de 180 alunos ativos em 4 projetos diferentes, formando campeões e cidadãos.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Nossa História
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Uma jornada de décadas dedicada à tradição, disciplina e formação de caráter através do karatê
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Filosofia e Tradição
          </h2>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p>
              O <strong className="text-primary">Alessandro Karatê Dojo</strong> é mais do que um espaço de treinamento – 
              é um templo de formação humana. Seguindo os ensinamentos do estilo <strong className="text-primary">Shorin-Ryu</strong>, 
              escola tradicional de Okinawa, cultivamos não apenas técnicas marciais, mas valores essenciais para a vida.
            </p>
            
            <p>
              Nossa linhagem remonta ao <strong>Shinshukan</strong>, preservando a autenticidade dos movimentos 
              e a profundidade filosófica que tornam o karatê uma arte de vida. Cada kata, cada técnica carrega 
              séculos de sabedoria transmitida de mestre para aluno.
            </p>

            <div className="bg-secondary/50 border-l-4 border-primary p-6 my-8 rounded-r">
              <p className="text-lg font-semibold text-foreground mb-2">
                "Não há primeiro ataque no karatê"
              </p>
              <p className="text-sm text-muted-foreground">
                - Gichin Funakoshi, Pai do Karatê Moderno
              </p>
            </div>

            <p>
              Nosso compromisso vai além do tatame. Através dos <strong className="text-primary">projetos sociais</strong>, 
              levamos disciplina, respeito e autoconfiança para crianças e jovens que mais precisam. Acreditamos que 
              o karatê transforma vidas e constrói cidadãos melhores.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Linha do Tempo
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {timeline.map((event, index) => (
              <Card 
                key={index} 
                className="border-primary/20 hover:border-primary transition-all hover:shadow-glow"
              >
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Style Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Shorin-Ryu Shinshukan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Características do Estilo</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Movimentos rápidos e precisos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Posições naturais e eficientes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Ênfase em técnicas diretas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Katas tradicionais de Okinawa</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Valores Cultivados</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Respeito e humildade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Disciplina e perseverança</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Autocontrole emocional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Espírito de superação</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Historia;
