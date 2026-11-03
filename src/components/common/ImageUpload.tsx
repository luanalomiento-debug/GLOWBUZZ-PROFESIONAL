import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { uploadPhoto } from '../../lib/sync';
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
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file, maxDim);
      // La foto se guarda en la carpeta de la cuenta y se usa su dirección (no la imagen completa dentro de los datos).
      const url = user ? await uploadPhoto(dataUrl, user.id) : dataUrl;
      if (!url) {
        showToast('No se pudo subir la foto', 'Revisá tu conexión e intentá de nuevo.', 'error');
        return;
      }
      onSelect(url);
    } catch (error) {
      showToast('No se pudo subir la imagen', error instanceof Error ? error.message : 'Probá con otra foto.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className={`cursor-pointer ${uploading ? 'opacity-60 pointer-events-none' : ''} ${className}`} title={title} aria-busy={uploading}>
      <input type="file" accept="image/*" className="sr-only" onChange={handleChange} disabled={uploading} />
      {children}
    </label>
  );
};
