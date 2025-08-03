import type { ReactNode } from 'react';

export interface AppState {
  searchQuery: string;
  error: boolean;
}

export interface MainProps {
  searchQuery: string;
}

export interface MainState {
  results: Array<{ name: string; url: string }>;
  loading: boolean;
  error: string | null;
}

export interface SearchProps {
  onSearch: (query: string) => void;
}

export interface SearchState {
  input: string;
  errorMsg: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  errorType: string;
  errorDetails?: string;
  showErrorModal: boolean;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}
export interface ErrorModalProps {
  message: string;
  details?: string;
  onRetry: () => void;
}

export interface ErrorModalState {
  unknown: unknown;
}

export interface PokemonCardProps {
  url: string;
  name: string;
  onSelect?: (pokemonId: string) => void;
}

export interface PokemonCardState {
  sprite: string | null;
}

export interface PokemonSliceState {
  selectedPokemons: Pokemon[];
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'error';
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

export interface PokemonDetailsProps {
  pokemonId?: string;
  onClose?: () => void;
}

export interface Pokemon {
  id: string;
  name: string;
  url: string;
}

export type Theme = 'light' | 'dark';
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
