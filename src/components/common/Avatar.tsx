import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  /** Clases de tamaño y forma, p. ej. "w-10 h-10 rounded-full". */
  className?: string;
}

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** Foto de perfil; si no hay foto (o no carga) muestra las iniciales sobre fondo blush. */
export const Avatar: React.FC<AvatarProps> = ({ src, name, className = 'w-10 h-10 rounded-full' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`${className} bg-[#F5DCE5] text-[#571C31] flex items-center justify-center text-xs font-bold flex-shrink-0 select-none`}
      >
        {initialsOf(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={`${className} object-cover border border-[#B82E5F]/20 flex-shrink-0`}
    />
  );
};
