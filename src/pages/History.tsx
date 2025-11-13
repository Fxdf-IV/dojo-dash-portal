import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Italic } from "lucide-react";
import BeltGrades from "@/components/BeltGrades";
const History = () => {
  const timeline = [
    {
      year: "Séculos XV–XVI",
      title: "As Origens de Okinawa",
      description: "Com a proibição do uso de armas, surgem em Okinawa as técnicas de defesa chamadas 'Te', que dariam origem ao Karate-Do."
    },
    {
      year: "Séculos XVIII–XIX",
      title: "Formação dos Estilos",
      description: "Nas cidades de Shuri, Naha e Tomari nascem escolas que formam as bases do Shorin-Ryu, estilo seguido pela Shinshukan."
    },
    {
      year: "1954",
      title: "Chegada ao Brasil",
      description: "O mestre Yoshihide Shinzato funda a Escola Shinshukan de Karate-Do e Kobudo em Santos (SP), introduzindo o Shorin-Ryu no país."
    },
    {
      year: "1973",
      title: "Nascimento do Sensei Alessandro",
      description: "Alessandro Rogério Alves Prado Pires nasce em São Paulo, futuro representante da linhagem Shinshukan."
    },
    {
      year: "1998",
      title: "O Caminho Começa",
      description: "Alessandro inicia seus treinos em Karate e Kobudo, inspirado por amigos e pela filosofia marcial."
    },
    {
      year: "2007",
      title: "Retorno e Dedicação",
      description: "Retoma os treinos com total empenho sob orientação de mestres da linhagem Shinshukan, como Sensei Gilson Nunes e Sensei Raimundo."
    },
    {
      year: "2016",
      title: "Dojo em Palmital",
      description: "Sensei Alessandro funda o projeto 'Karatê para Todos' em Palmital (SP), com apoio da família e da comunidade local."
    },
    {
      year: "2018",
      title: "Expansão do Kobudo",
      description: "Leva o Kobudo Shinshukan para as cidades de Marília e Pirapozinho, fortalecendo o estilo no interior paulista."
    },
    {
      year: "2022",
      title: "Reconhecimento Municipal",
      description: "A Câmara de Palmital institui o Dia Municipal do Karatê em 31 de julho — data de nascimento do sensei."
    },
    {
      year: "2025",
      title: "Conquista Mundial",
      description: "Sensei Alessandro conquista medalha de bronze no Campeonato Mundial de Karate e Kobudo Shinshukan, em Praia Grande (SP)."
    }
  ];
  
  return <div className="min-h-screen pt-20">
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

      {/* History of Life and Dojo Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            História de Vida e do Dojo
          </h2>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p>
              <strong className="text-primary">Alessandro Rogério Alves Prado Pires</strong>, conhecido como Sensei Alessandro, 
              nasceu em 31 de julho de 1973, em São Paulo (SP). É <strong className="text-primary">4º dan em Karatê Shorin-Ryu</strong> e 
              <strong className="text-primary"> 2º dan em Kobudo</strong> pela <strong className="text-primary">International Shorin-Ryu Karate-Do e Kobudo Shinshukan</strong>, 
              escola fundada pelo Grão-Mestre <strong className="text-primary">Yoshihide Shinzato</strong>, responsável por trazer o estilo Shorin-Ryu ao Brasil em 1954.
            </p>

            <p>
              Sua trajetória nas artes marciais começou em 1998, incentivado por amigos. Após uma pausa por motivos profissionais e familiares, 
              retornou em 2007 com dedicação total sob a orientação dos senseis Gilson Nunes, Raimundo e Danilo. 
              Desde então, recebeu influência direta de grandes mestres da linhagem Shinshukan, como 
              <em>Yoshihide, Masahiro, Mitsuhide e Hirokazu Shinzato, Clebert Eimori Kato, Kyochi Maurici Aragão Tavares, Marco Teixeira, 
              Jorge Yoshimura e Rogério Eng Wong</em>.
            </p>

            <div className="bg-secondary/50 border-l-4 border-primary p-6 my-8 rounded-r">
              <p className="text-lg font-semibold text-foreground mb-2">
                “O Karatê e o Kobudo se completam — 60% mãos vazias, 40% armas que se tornam extensões do corpo.”
              </p>
              <p className="text-sm text-muted-foreground text-white">
                Princípio que define a escola Shinshukan
              </p>
            </div>

            <p>
              Ao mudar-se para Palmital (SP), Sensei Alessandro iniciou uma nova fase: inspirou sua esposa e filhos — hoje também faixas-pretas — 
              e juntos fundaram o projeto <strong className="text-primary">Karatê para Todos</strong>, em parceria com a Prefeitura Municipal, APAE, Colégio Expoente, 
              Projeto Gota Verde e o Complexo Esportivo Maylson Campos. 
              Desde 2018, também levou o Kobudo Shinshukan para Marília e Pirapozinho, expandindo a tradição da escola no interior paulista.
            </p>

            <p>
              Seu trabalho foi reconhecido oficialmente: em 2019, recebeu <strong className="text-primary">moção de parabenização da Câmara de Vereadores de Palmital </strong>
              e, em 2022, a cidade instituiu o <strong className="text-primary">Dia Municipal do Karatê</strong>, celebrado em 31 de julho — sua data de nascimento.
            </p>

            <p>
              Sensei Alessandro tem como missão formar crianças e adolescentes por meio das artes marciais, promovendo inclusão e socialização. 
              Defende que o Karatê e o Kobudo vão além da técnica — ensinam valores como respeito, autocontrole e trabalho em equipe, essenciais para a vida em sociedade.
            </p>

            <p>
              Reconhecendo que trilhar esse caminho exige esforço e resiliência, expressa profunda gratidão à família, alunos e mestres que o acompanham. 
              Para ele, viver é evoluir constantemente — fiel ao espírito da <strong className="text-primary">Shinshukan</strong> e aos ideais de seus mestres.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Filosofia e Tradição
          </h2>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <div className="bg-secondary/50 border-l-4 border-primary p-6 my-8 rounded-r">
              <p className="text-lg font-semibold text-foreground mb-2">
                “A chave para a imortalidade é ter uma vida que mereça ser lembrada.”
              </p>
              <p className="text-sm text-muted-foreground text-white">
                — Sensei Alessandro Pires
              </p>
            </div>

            <p>
              Para Sensei Alessandro, lutar é trilhar um caminho de sacrifício, persistência e superação.
              Vencer exige coragem para enfrentar, perseverar e resistir — valores que refletem o espírito da 
              <strong className="text-primary"> Shinshukan</strong>, herdeira do legado de Okinawa.
            </p>

            <p>
              O propósito das artes marciais, segundo ele, é aprender a enfrentar as adversidades com equilíbrio, técnica e justiça. 
              Treinar Karatê e Kobudo não é apenas dominar técnicas, mas forjar caráter — transformar a energia do combate em harmonia interior.
            </p>

            <p>
              A filosofia do dojo busca formar cidadãos éticos e conscientes, que reconhecem suas limitações e buscam a paz interior. 
              Respeito, autocontrole e trabalho em equipe são, para a Shinshukan, armas tão poderosas quanto qualquer <em>bo</em>, <em>tonfa</em> ou <em>katana</em>.
            </p>

            <p>
              Para Sensei Alessandro, o verdadeiro caminho do guerreiro moderno é educar e humanizar, 
              unindo técnica, disciplina e compaixão. 
              Por isso, expressa gratidão à família, alunos e mestres — pilares que sustentam sua missão de viver em constante evolução.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
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

      {/* Style Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
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
    
      {/* Belt Grades Section */}
      <section className="py-20 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Sistema de Graduação
          </h2>
          <BeltGrades />
        </div>
      </section>
    </div>;
};
export default History;