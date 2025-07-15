export interface AppState {
  searchQuery: string;
}

export interface MainProps {
  searchQuery: string;
}

export interface MainState {
  results: Array<{ name: string; url: string }>;
  loading: boolean;
  error: string | null;
}

export interface HeaderProps {
  onSearch: (query: string) => void;
}

export interface HeaderState {
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
  children?: React.ReactNode;
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
}

export interface PokemonCardState {
  sprite: string | null;
}
