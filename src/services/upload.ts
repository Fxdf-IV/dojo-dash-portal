import { apiRequest } from './api';

interface UploadResponse {
  imageUrl: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    console.log('[Upload Service] Iniciando upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // NÃO definir Content-Type manualmente - o navegador fará isso automaticamente
    // com o boundary correto para multipart/form-data

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const url = `${API_BASE_URL}/upload/image`;
    
    console.log('[Upload Service] Enviando para:', url);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('[Upload Service] Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Upload Service] Erro na resposta:', errorText);
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || 'Erro desconhecido' };
        }
        
        throw new Error(error.error || error.message || 'Erro ao fazer upload da imagem');
      }

      const data: UploadResponse = await response.json();
      console.log('[Upload Service] Upload bem-sucedido:', data);
      return data.imageUrl;
    } catch (error: any) {
      console.error('[Upload Service] Erro no fetch:', error);
      throw error;
    }
  },

  /**
   * Extrai o ID da imagem de uma URL
   * Ex: /api/upload/image/507f1f77bcf86cd799439011 -> 507f1f77bcf86cd799439011
   */
  extractImageId(imageUrl: string): string | null {
    if (!imageUrl) return null;
    
    // Se a URL começa com /api/upload/image/, extrai o ID
    if (imageUrl.startsWith('/api/upload/image/')) {
      return imageUrl.replace('/api/upload/image/', '');
    }
    
    // Se é apenas o ID, retorna como está
    if (imageUrl.length === 24 && /^[a-f0-9]{24}$/i.test(imageUrl)) {
      return imageUrl;
    }
    
    return null;
  },

  /**
   * Verifica se uma URL de imagem é do MongoDB
   */
  isMongoDBImageUrl(imageUrl: string): boolean {
    if (!imageUrl) return false;
    return imageUrl.startsWith('/api/upload/image/') || 
           (imageUrl.length === 24 && /^[a-f0-9]{24}$/i.test(imageUrl));
  },

  /**
   * Remove uma imagem do MongoDB
   * Retorna true se a imagem foi deletada, false se a URL não é válida (imagem antiga)
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    console.log('[Upload Service] deleteImage chamado com URL:', imageUrl);
    
    if (!imageUrl) {
      console.log('[Upload Service] URL vazia, nada para deletar');
      return false;
    }

    const imageId = this.extractImageId(imageUrl);
    console.log('[Upload Service] ID extraído:', imageId);
    
    // Se não conseguir extrair o ID, provavelmente é uma URL antiga (/uploads/...)
    // Nesse caso, não há nada para deletar no MongoDB, apenas retornar false silenciosamente
    if (!imageId) {
      console.log('[Upload Service] URL não é do MongoDB (provavelmente URL antiga), ignorando:', imageUrl);
      // Não lançar erro, apenas retornar false
      return false;
    }

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const url = `${API_BASE_URL}/upload/image/${imageId}`;
    
    console.log('[Upload Service] Removendo imagem do MongoDB:', url);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Upload Service] Erro ao remover imagem:', errorText);
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || 'Erro desconhecido' };
        }
        
        throw new Error(error.error || error.message || 'Erro ao remover imagem');
      }

      console.log('[Upload Service] Imagem removida com sucesso do MongoDB');
      return true;
    } catch (error: any) {
      console.error('[Upload Service] Erro no fetch:', error);
      throw error;
    }
  },
};

