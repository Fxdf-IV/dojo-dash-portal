import { Sensei, Location, Event } from '../types';

export const mockSenseis: Sensei[] = [
  {
    id: '1',
    name: 'Mestre Exemplo 3',
    rank: '7º Dan',
    description: 'Mestre principal com mais de 40 anos de experiência em Karate Shotokan. Dedicado ao ensino da filosofia e técnica.',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sensei Exemplo 2',
    rank: '4º Dan',
    description: 'Especialista em Kata e defesa pessoal. Campeã nacional por 3 anos consecutivos.',
    imageUrl: 'https://images.unsplash.com/photo-1583487566148-523170967526?q=80&w=1974&auto=format&fit=crop',
    orderIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sensei Exemplo 1',
    rank: '3º Dan',
    description: 'Focado no treinamento de competição e Kumite. Responsável pela equipe juvenil.',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    orderIndex: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Dojo Central - Matriz',
    description: 'Nossa sede principal, com amplo espaço, tatame olímpico e área de musculação.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975860215!2d-46.6520!3d-23.5629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQ2LjQiUyA0NsKwMzknMDcuMiJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop', caption: 'Área de treino' },
      { imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop', caption: 'Fachada' }
    ],
    schedule: [
      { day: 'Segunda', startTime: '18:00', endTime: '22:00' },
      { day: 'Quarta', startTime: '18:00', endTime: '22:00' },
      { day: 'Sexta', startTime: '18:00', endTime: '21:00' }
    ],
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Unidade Jardins',
    description: 'Localizada no coração dos Jardins, ideal para quem busca treinos no horário de almoço ou início da noite.',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.66!3d-23.56!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzM2LjAiUyA0NsKwMzknMzYuMCJX!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop', caption: 'Interior' }
    ],
    schedule: [
      { day: 'Terça', startTime: '07:00', endTime: '20:00' },
      { day: 'Quinta', startTime: '07:00', endTime: '20:00' }
    ],
    orderIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Exame de Faixa - Inverno 2025',
    description: 'Exame de graduação para todas as faixas coloridas (Kyu). Inscrições abertas na secretaria.',
    date: '2025-07-15T09:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1518310952931-b1de3221b65c?q=80&w=2070&auto=format&fit=crop',
    registrationPrice: 150.00,
    registeredStudents: [],
    registeredCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Seminário de Kumite com Mestre Tanaka',
    description: 'Seminário especial focado em técnicas avançadas de luta e estratégia de competição.',
    date: '2025-08-20T14:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    registrationPrice: 200.00,
    registeredStudents: [],
    registeredCount: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Torneio Interno de Kata',
    description: 'Competição amistosa entre os alunos de todas as unidades. Categorias por idade e graduação.',
    date: '2025-09-10T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    registrationPrice: 50.00,
    registeredStudents: [],
    registeredCount: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
