import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultipleImageUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // em MB
  maxFiles?: number;
  className?: string;
  label?: string;
  placeholder?: string;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSize = 5, // 5MB por padrão
  maxFiles = 10, // 10 imagens por padrão
  className,
  label,
  placeholder = "Clique para selecionar múltiplas imagens"
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar previews com os arquivos
  useEffect(() => {
    if (value.length === 0) {
      setPreviews([]);
      return;
    }

    // Criar previews para todos os arquivos
    const newPreviews: string[] = [];
    let loadedCount = 0;

    value.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string;
        loadedCount++;

        if (loadedCount === value.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [value]);

  const handleFileSelect = (newFiles: File[]) => {
    if (disabled) return;


    const validFiles: File[] = [];
    const currentFiles = value || [];

    for (const file of newFiles) {
      // Verificar se não excede o limite de arquivos
      if (currentFiles.length + validFiles.length >= maxFiles) {
        alert(`Máximo de ${maxFiles} imagens permitidas`);
        break;
      }

      // Validar tipo de arquivo
      const allowedTypes = accept.split(',').map(type => type.trim());
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type);
        }
        return file.type === type || file.type.startsWith(type.replace('*', ''));
      });

      if (!isValidType) {
        alert(`Tipo de arquivo não permitido: ${file.name}. Tipos aceitos: ${accept}`);
        continue;
      }

      // Validar tamanho
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Arquivo muito grande: ${file.name}. Tamanho máximo: ${maxSize}MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const allFiles = [...currentFiles, ...validFiles];
      onChange(allFiles);
      // Os previews serão criados pelo useEffect
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    // Os previews serão atualizados pelo useEffect
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && <Label>{label}</Label>}

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3">
            {dragOver ? (
              <Upload className="w-8 h-8 text-primary" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="mb-2">
            <p className="text-sm font-medium">
              {dragOver ? "Solte as imagens aqui" : placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxFiles} imagens, {maxSize}MB cada
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className="pointer-events-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Selecionar Imagens
          </Button>
        </div>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Imagens Selecionadas ({value.length}/{maxFiles})
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  {previews[index] ? (
                    <img
                      src={previews[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}

                <div className="absolute bottom-1 left-1 right-1">
                  <div className="bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                    {file.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
