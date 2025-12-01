import { Sensei, Location, Event, Student, Material } from '../types';

export const mockSenseis: Sensei[] = [
  {
    id: '1',
    name: 'Sensei Principal',
    rank: '7º Dan',
    description: 'Mestre com vasta experiência, responsável pela direção técnica do Dojo. Dedicado ao ensino da filosofia e técnica.',
    imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
    orderIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Instrutor Sênior',
    rank: '4º Dan',
    description: 'Especialista em Kata e defesa pessoal. Focado no desenvolvimento técnico dos alunos avançados.',
    imageUrl: 'https://images.unsplash.com/photo-1583487566148-523170967526?q=80&w=1974&auto=format&fit=crop',
    orderIndex: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Instrutor de Base',
    rank: '3º Dan',
    description: 'Responsável pelas turmas infantis e iniciantes. Focado na formação de base e disciplina.',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    orderIndex: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Unidade Principal',
    description: 'Nossa sede principal, com amplo espaço, tatame olímpico e infraestrutura completa para treinos de alto nível.',
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
    name: 'Unidade Filial',
    description: 'Localizada em ponto estratégico, ideal para quem busca treinos em horários alternativos.',
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
    title: 'Exame de Faixa',
    description: 'Evento de graduação para avaliação técnica e promoção de faixas dos alunos.',
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
    title: 'Seminário Técnico',
    description: 'Workshop especial focado no aprimoramento de técnicas avançadas e estratégias.',
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
    title: 'Torneio Interno',
    description: 'Competição amistosa para integração dos alunos e vivência esportiva.',
    date: '2025-09-10T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    registrationPrice: 50.00,
    registeredStudents: [],
    registeredCount: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    birthDate: '2010-05-15',
    phone: '(11) 99999-1111',
    startDate: '2023-02-10',
    beltId: 'yellow',
    location: '1', // Dojo Central
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    birthDate: '2012-08-20',
    phone: '(11) 98888-2222',
    startDate: '2023-06-15',
    beltId: 'orange',
    location: '2', // Unidade Jardins
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    birthDate: '2008-03-10',
    phone: '(11) 97777-3333',
    startDate: '2022-01-20',
    beltId: 'green',
    location: '1', // Dojo Central
    status: 'inactive',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Exemplo de Matéria 2',
    type: 'kata',
    description: 'Descrição do material de estudo.',
    content: 'Conteúdo detalhado do material...',
    videoUrl: 'https://www.youtube.com/embed/9Z6WwD7y3j4', // Exemplo
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop',
    minBeltId: 'white',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Exemplo de Matéria 1',
    type: 'kihon',
    description: 'Guia de técnicas básicas.',
    content: 'Lista de técnicas e fundamentos...',
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
    minBeltId: 'white',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Exemplo de Matéria 4',
    type: 'bunkai',
    description: 'Aplicação prática das técnicas.',
    videoUrl: 'https://www.youtube.com/embed/example',
    minBeltId: 'yellow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
