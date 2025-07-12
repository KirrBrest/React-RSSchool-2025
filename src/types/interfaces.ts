export interface AppState {
  searchQuery: string;
}

export interface MainProps {
  searchQuery: string;
}

export interface MainState {
  results: Array<{ title: string; description: string }>;
  loading: boolean;
  error: string | null;
}

export interface HeaderProps {
  onSearch: (query: string) => void;
}

export interface HeaderState {
  input: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export interface ErrorBoundaryProps {
  children?: React.ReactNode;
}
