import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string; // URL da imagem atual
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // em MB
  className?: string;
  label?: string;
  placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png,image/gif,image/webp",
  maxSize = 5, // 5MB por padrão
  className,
  label,
  placeholder = "Clique para selecionar uma imagem"
}) => {
  const [preview, setPreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset isRemoved when value changes (e.g., when opening edit modal)
  useEffect(() => {
    setIsRemoved(false);
  }, [value]);

  const handleFileSelect = (file: File) => {
    if (disabled) return;

    // Validar tipo de arquivo
    const allowedTypes = accept.split(',').map(type => type.trim());
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type === type || file.type.startsWith(type.replace('*', ''));
    });

    if (!isValidType) {
      alert(`Tipo de arquivo não permitido. Tipos aceitos: ${accept}`);
      return;
    }

    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsRemoved(false); // Reset removed state when new file is selected
    onChange(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
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
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview("");
    setIsRemoved(true);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const currentImage = preview || (!isRemoved ? value : null);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5",
          currentImage ? "border-solid" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
        />

        {currentImage ? (
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3">
              {dragOver ? (
                <Upload className="w-8 h-8 text-primary" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {dragOver ? "Solte a imagem aqui" : placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxSize}MB • Formatos: JPG, PNG, GIF, WebP
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
