import React from 'react';
import { useToast } from '../../context/ToastContext';
import { fileToDataUrl } from '../../utils/image';

interface ImageUploadProps {
  onSelect: (dataUrl: string) => void;
  /** Lado mayor máximo en px (las fotos de perfil pueden ser más chicas que las de trabajos). */
  maxDim?: number;
  className?: string;
  title?: string;
  children: React.ReactNode;
}

/**
 * Botón para subir una imagen. En computadora abre el explorador de archivos y en el
 * celular ofrece el carrete de fotos (o la cámara).
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  onSelect,
  maxDim = 1200,
  className = '',
  title,
  children,
}) => {
  const { showToast } = useToast();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    try {
      onSelect(await fileToDataUrl(file, maxDim));
    } catch (error) {
      showToast('No se pudo subir la imagen', error instanceof Error ? error.message : 'Probá con otra foto.', 'error');
    }
  };

  return (
    <label className={`cursor-pointer ${className}`} title={title}>
      <input type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      {children}
    </label>
  );
};
