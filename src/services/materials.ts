import { apiRequest } from './api';
import { uploadService } from './upload';
import type { Material } from '@/types';

interface MaterialsResponse {
  materials: Material[];
}

interface MaterialResponse {
  material: Material;
}

export const materialsService = {
  async getAll(filters?: { type?: string; min_kyu?: number }): Promise<Material[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.min_kyu) params.append('min_kyu', filters.min_kyu.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<MaterialsResponse>(`/materials${query}`, {
      requireAuth: true,
    });

    return response.materials;
  },

  async getById(id: string): Promise<Material> {
    const response = await apiRequest<MaterialResponse>(`/materials/${id}`, {
      requireAuth: true,
    });

    return response.material;
  },

  async create(data: Partial<Material> | FormData): Promise<Material> {
    if (data instanceof FormData) {
      // Extrair dados do FormData
      const materialData: Partial<Material> = {
        title: data.get('title') as string,
        type: data.get('type') as Material['type'],
        description: data.get('description') as string || undefined,
        content: data.get('content') as string || undefined,
        videoUrl: data.get('videoUrl') as string || undefined,
        minBeltId: data.get('minBeltId') as string || 'white',
      };

      // Upload de imagem se existir
      const imageFile = data.get('image') as File;
      if (imageFile) {
        materialData.imageUrl = await uploadService.uploadImage(imageFile);
      }

      // Upload de vídeo se existir
      const videoFile = data.get('video') as File;
      if (videoFile) {
        materialData.videoUrl = await uploadService.uploadImage(videoFile); // Assumindo que o upload service suporta vídeos também
      }

      return this.create(materialData);
    }

    const response = await apiRequest<MaterialResponse>('/materials', {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.material;
  },

  async update(id: string, data: Partial<Material> | FormData): Promise<Material> {
    if (data instanceof FormData) {
      // Primeiro, buscar o material atual para verificar imagens existentes
      const currentMaterial = await this.getById(id);

      // Extrair dados do FormData
      const materialData: Partial<Material> = {
        title: data.get('title') as string,
        type: data.get('type') as Material['type'],
        description: data.get('description') as string || undefined,
        content: data.get('content') as string || undefined,
        videoUrl: data.get('videoUrl') as string || undefined,
        minBeltId: data.get('minBeltId') as string || 'white',
      };

      // Upload de nova imagem se existir
      const imageFile = data.get('image') as File;
      if (imageFile) {
        // Remover imagem antiga se existir
        if (currentMaterial.imageUrl) {
          try {
            await uploadService.deleteImage(currentMaterial.imageUrl);
          } catch (error) {
            console.warn('Erro ao remover imagem anterior:', error);
          }
        }
        materialData.imageUrl = await uploadService.uploadImage(imageFile);
      } else {
        // Manter imagem existente se não houver nova
        materialData.imageUrl = currentMaterial.imageUrl;
      }

      // Upload de novo vídeo se existir
      const videoFile = data.get('video') as File;
      if (videoFile) {
        materialData.videoUrl = await uploadService.uploadImage(videoFile);
      }

      return this.update(id, materialData);
    }

    const response = await apiRequest<MaterialResponse>(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth: true,
    });

    return response.material;
  },

  async delete(id: string): Promise<void> {
    // Buscar material para remover imagens associadas
    try {
      const material = await this.getById(id);

      // Remover imagem se existir
      if (material.imageUrl) {
        try {
          await uploadService.deleteImage(material.imageUrl);
        } catch (error) {
          console.warn('Erro ao remover imagem do material:', error);
        }
      }
    } catch (error) {
      console.warn('Erro ao buscar material para remoção de imagens:', error);
    }

    await apiRequest(`/materials/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
