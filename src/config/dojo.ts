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
  name: 'Dojo Exemplo (Mock)',
  description: 'Este é um dojo fictício para demonstração do portfólio. Nenhum dado aqui é real.',
  location: 'Cidade Exemplo - EX',
  phone: '(00) 00000-0000',
  email: 'contato@dojoexemplo.com',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  }
};
