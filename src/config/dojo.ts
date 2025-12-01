export interface DojoConfig {
  name: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  social: {
    facebook: string;
    instagram: string;
    youtube?: string;
  };
}

export const dojoConfig: DojoConfig = {
  name: 'Dojo Dash Portal',
  description: 'A plataforma completa para gestão do seu Dojo ou negócio. Organize alunos, eventos, graduações e muito mais em um só lugar.',
  location: 'Seu negocio aqui',
  phone: '(11) 99999-9999',
  email: 'contato@dojodash.com',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  }
};
