/**
 * Normaliza uma URL de imagem para garantir que seja acessível
 * Suporta URLs do MongoDB (/api/upload/image/:id) e URLs antigas (/uploads/)
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) {
    return '';
  }

  // Se já é uma URL absoluta (http/https), retorna como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Se começa com /api/upload/image, retorna como está (imagem do MongoDB)
  if (url.startsWith('/api/upload/image/')) {
    return url;
  }

  // Se começa com /uploads, retorna como está (compatibilidade com URLs antigas)
  if (url.startsWith('/uploads/')) {
    return url;
  }

  // Se começa com /, retorna como está
  if (url.startsWith('/')) {
    return url;
  }

  // Caso contrário, assume que é um ID do MongoDB e cria a URL da API
  return `/api/upload/image/${url}`;
}

