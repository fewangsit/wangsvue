export const formatUserName = (name?: string): string => {
  if (!name) return '-';
  if (name.length <= 8) return name;

  const splitted = name.split(' ');

  if (splitted.length === 1) {
    return `${splitted[0].slice(0, 8)}..`;
  }

  const firstToRestWord = splitted.slice(0, -1).join(' ');

  const firstWord =
    firstToRestWord.length > 8
      ? `${firstToRestWord.slice(0, 8)}..`
      : firstToRestWord;

  const lastWord = splitted[splitted.length - 1];

  return `${firstWord} ${lastWord.slice(0, 1)}`;
};
