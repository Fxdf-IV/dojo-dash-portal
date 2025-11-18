import React from 'react';
import { cn } from '@/lib/utils';

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 * Suporta formatos:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;

  // Regex para diferentes formatos de URL do YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Componente para renderizar vídeos do YouTube como iframe
 */
export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  title = "Vídeo do YouTube",
  className,
  width = "100%",
  height = "315"
}) => {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    // Se não conseguir extrair o ID, exibe um link normal
    return (
      <div className={cn("aspect-video bg-muted/50 rounded flex items-center justify-center", className)}>
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Vídeo não disponível</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline text-sm"
          >
            Abrir link original
          </a>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={cn("aspect-video overflow-hidden rounded-lg", className)}>
      <iframe
        width={width}
        height={height}
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};

/**
 * Hook para verificar se uma URL é do YouTube
 */
export const useIsYouTubeUrl = (url?: string): boolean => {
  if (!url) return false;
  return extractYouTubeId(url) !== null;
};

export default YouTubeEmbed;
