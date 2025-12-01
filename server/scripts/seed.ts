import mongoose from 'mongoose';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Material from '../models/Material.js';
import Location from '../models/Location.js';
import Sensei from '../models/Sensei.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    console.log('🌱 Iniciando seed...');
    console.log('Conectando ao MongoDB...');

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Conectado ao MongoDB');

  console.log('Limpando dados existentes...');
  await User.deleteMany({});
  await Student.deleteMany({});
  await Material.deleteMany({});
  await Location.deleteMany({});
  await Sensei.deleteMany({});
  console.log('✅ Dados limpos');

    console.log('Criando usuários...');

    const admin = await User.create({
      email: 'adm@email.com',
      password: '1234',
      role: 'admin',
    });
    console.log('✅ Admin criado:', admin.email);

    // Criar aluno 1
    const student1User = await User.create({
      email: 'aluno@email.com',
      password: '1234',
      role: 'student',
    });
    await Student.create({
      userId: student1User._id,
      name: 'Aluno Teste',
      email: student1User.email,
      beltId: 'red-10', // Mudança: 10º Dan para testar
      location: 'CT Maylson Campos',
      status: 'active',
    });
    console.log('✅ Aluno criado:', student1User.email);

    // Criar aluno 2
    const student2User = await User.create({
      email: 'maria@email.com',
      password: '1234',
      role: 'student',
    });
    await Student.create({
      userId: student2User._id,
      name: 'Maria Santos',
      email: student2User.email,
      beltId: 'gray',
      location: 'Bola e Cidadania',
      status: 'active',
    });
    console.log('✅ Aluna criada:', student2User.email);

    // Criar aluno 3 (pendente)
    const student3User = await User.create({
      email: 'pedro@email.com',
      password: '1234',
      role: 'student',
    });
    await Student.create({
      userId: student3User._id,
      name: 'Pedro Oliveira',
      email: student3User.email,
      beltId: 'red-kyu',
      location: 'Projeto Gota Verde',
      status: 'pending',
    });
    console.log('✅ Aluno criado:', student3User.email);

    // Criar materiais de exemplo
  console.log('\nCriando locais...');

  const locations = [
    {
      name: 'CT Maylson Campos',
      description: 'Centro de treinamento principal com infraestrutura completa para formação técnica e espiritual. Equipado com tatames profissionais, ambiente climatizado e espaço dedicado ao estudo da tradição Shorin-Ryu.',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3696.654724742981!2d-50.22067522374668!3d-22.09999997983161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495111111111111%3A0x1111111111111111!2sPalmital%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
      imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2062',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2062',
          caption: 'Dojo principal - vista geral'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070',
          caption: 'Área de treinamento com tatames'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070',
          caption: 'Espaço para meditação e estudo'
        }
      ]
    },
    {
      name: 'Bola e Cidadania',
      description: 'Projeto social que transforma vidas através do karatê. Atendemos comunidades carentes levando valores como disciplina, respeito e cidadania. Mais que técnicas marciais, formamos cidadãos conscientes e comprometidos.',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3696.654724742981!2d-50.22067522374668!3d-22.09999997983161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495111111111111%3A0x1111111111111111!2sPalmital%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=2071',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=2071',
          caption: 'Crianças em treinamento'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070',
          caption: 'Atividades em grupo'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2062',
          caption: 'Formação de valores'
        }
      ]
    },
    {
      name: 'Projeto Gota Verde',
      description: 'Iniciativa que une karatê tradicional e consciência ambiental. Praticamos em harmonia com a natureza, realizando treinos ao ar livre e atividades de preservação. O respeito do dojo se estende ao planeta.',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3696.654724742981!2d-50.22067522374668!3d-22.09999997983161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495111111111111%3A0x1111111111111111!2sPalmital%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
          caption: 'Treino ao ar livre'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071',
          caption: 'Harmonia com a natureza'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070',
          caption: 'Atividades de preservação'
        }
      ]
    },
    {
      name: 'Colégio Expoente',
      description: 'Parceria educacional que integra o karatê ao ambiente escolar. Os alunos desenvolvem disciplina, concentração e autocontrole que refletem no desempenho acadêmico. Uma formação que une corpo, mente e conhecimento.',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3696.654724742981!2d-50.22067522374668!3d-22.09999997983161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9495111111111111%3A0x1111111111111111!2sPalmital%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070',
      images: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070',
          caption: 'Aula no ambiente escolar'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=2071',
          caption: 'Integração educacional'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2062',
          caption: 'Formação integral'
        }
      ]
    }
  ];

  await Location.insertMany(locations);
  console.log('✅ 4 locais criados');

  console.log('\nCriando materiais...');

  const materials = [
      // Kihons
      {
        title: 'Gedan Barai',
        type: 'kihon',
        description: 'Bloco baixo com o braço de fora para dentro',
        content: 'Movimento fundamental de defesa baixa. Execução: braço direito cruza o corpo e bloqueia para baixo.',
        minBeltId: 'white',
      },
      {
        title: 'Age Uke',
        type: 'kihon',
        description: 'Bloco alto com o antebraço',
        content: 'Defesa contra ataques altos. Antebraço sobe em movimento circular.',
        minBeltId: 'white',
      },
      {
        title: 'Oi Zuki',
        type: 'kihon',
        description: 'Soco direto com o braço da frente',
        content: 'Ataque linear básico. Punho parte da cintura e vai direto ao alvo.',
        minBeltId: 'red-kyu',
      },
      {
        title: 'Oi Zuki Avançado',
        type: 'kihon',
        description: 'Técnica avançada de soco direto para mestres',
        content: 'Variação avançada do Oi Zuki com aplicações táticas e princípios de alta graduação.',
        minBeltId: 'coral-7', // 7º Dan para testar
      },

      // Katas
      {
        title: 'Heian Shodan',
        type: 'kata',
        description: 'Primeiro kata básico com 21 movimentos',
        content: 'Kata introdutório que ensina os movimentos fundamentais do karatê.',
        minBeltId: 'white',
      },
      {
        title: 'Heian Nidan',
        type: 'kata',
        description: 'Segundo kata básico com 26 movimentos',
        content: 'Evolução do Heian Shodan, introduz novos bloqueios e ataques.',
        minBeltId: 'red-kyu',
      },
      {
        title: 'Heian Sandan',
        type: 'kata',
        description: 'Terceiro kata da série Heian',
        content: 'Kata mais dinâmico com mudanças de ritmo e técnicas avançadas.',
        minBeltId: 'yellow',
      },

      // Theory
      {
        title: 'Etiqueta do Dojo',
        type: 'theory',
        description: 'Regras de comportamento no dojo',
        content: 'Respeito, disciplina e tradições que devem ser seguidas durante o treinamento.',
        minBeltId: 'white',
      },
      {
        title: 'Terminologia Básica',
        type: 'theory',
        description: 'Principais termos usados no karatê',
        content: 'Vocabulário essencial: Dojo, Sensei, Rei, Hajime, Yame, etc.',
        minBeltId: 'white',
      },
      {
        title: 'História do Karatê',
        type: 'theory',
        description: 'Origem e desenvolvimento da arte marcial',
        content: 'Das origens em Okinawa até o karatê moderno. Principais mestres e estilos.',
        minBeltId: 'orange',
      },

      // Bunkai
      {
        title: 'Bunkai Heian Shodan',
        type: 'bunkai',
        description: 'Aplicações práticas do kata Heian Shodan',
        content: 'Como usar os movimentos do kata em situações de combate real.',
        minBeltId: 'red-kyu',
      },
      {
        title: 'Defesa contra Agarrões',
        type: 'bunkai',
        description: 'Técnicas de escape e contra-ataque',
        content: 'Aplicações práticas para se livrar de agarrões e imobilizações.',
        minBeltId: 'yellow',
      },
    ];

    for (const materialData of materials) {
      await Material.create(materialData);
    }

    console.log(`✅ ${materials.length} materiais criados`);

    console.log('\nCriando senseis...');

    const senseis = [
      {
        name: 'Sensei Alessandro',
        rank: '4º Dan - Faixa Preta',
        description: 'Fundador do Alessandro Karatê e Kobudo, com mais de 25 anos de experiência no Shorin-Ryu. Dedicado à formação técnica e filosófica dos alunos, mantendo viva a tradição do karatê de Okinawa.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070',
        orderIndex: 0,
      },
      {
        name: 'Sensei Milena',
        rank: '2º Dan - Faixa Preta',
        description: 'Especialista em kata e bunkai, responsável pelo desenvolvimento técnico dos alunos. Referência em competições regionais e instrutora do projeto Bola e Cidadania.',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070',
        orderIndex: 1,
      },
      {
        name: 'Sensei Vinicius',
        rank: '1º Dan - Faixa Preta',
        description: 'Instrutor focado no trabalho com crianças e adolescentes. Coordena as atividades no Colégio Expoente e no Projeto Gota Verde, unindo disciplina marcial e consciência ambiental.',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070',
        orderIndex: 2,
      }
    ];

    await Sensei.insertMany(senseis);
    console.log('✅ 3 senseis criados');

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📝 Credenciais de teste:');
    console.log('   Admin: adm@email.com / 1234');
    console.log('   Aluno: aluno@email.com / 1234');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seed();
