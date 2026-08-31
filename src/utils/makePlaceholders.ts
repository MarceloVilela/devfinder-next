function makePlaceholders<T>(count: number): T[] {
  return Array.from({ length: count }, () => ({} as T));
}

export default makePlaceholders;
