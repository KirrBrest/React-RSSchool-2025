const processSearchQuery = (query: string): string | null => {
  const trimmed = query.trim();
  if (trimmed.includes(' ')) return null;
  return trimmed;
};

export default processSearchQuery;
