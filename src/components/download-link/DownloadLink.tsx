import React, { useRef } from 'react';
import type { Pokemon } from '@/types/interfaces';

interface DownloadLinkProps {
  pokemons: Pokemon[];
  children: React.ReactNode;
  className?: string;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({
  pokemons,
  children,
  className,
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = () => {
    if (pokemons.length === 0 || !linkRef.current) return;

    const headers = ['ID', 'Name', 'URL', 'Details URL'];
    const csvContent = [
      headers.join(','),
      ...pokemons.map((pokemon) =>
        [
          pokemon.id,
          pokemon.name,
          pokemon.url,
          `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    linkRef.current.href = url;
    linkRef.current.download = `${pokemons.length}_items.csv`;
    linkRef.current.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <>
      <a
        ref={linkRef}
        style={{ display: 'none' }}
        download={`${pokemons.length}_items.csv`}
      />
      <button onClick={handleDownload} className={className}>
        {children}
      </button>
    </>
  );
};

export default DownloadLink;
