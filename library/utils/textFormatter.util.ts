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

export const getInititalName = (
  existing: string[],
  fullName?: string,
  maxLength = 3,
): string => {
  if (!fullName) return '';

  // Split the full name into an array of words
  const words = fullName.split(' ');

  // Initialize an empty string to store the initials
  let initials = '';

  // Iterate over each word in the array

  for (const word of words) {
    initials += word.charAt(0).toUpperCase();
  }

  if (!existing?.length || !existing.includes(initials)) return initials;

  return getInitialsByConsonant(existing, fullName, maxLength);
};

export const getInitialsByConsonant = (
  existingInitials: string[],
  fullName: string,
  maxLength: number,
): string => {
  if (!fullName) return '';

  const words = fullName.split(' ');
  let initials = '';

  const getInitial = (): void => {
    for (const word of words) {
      const consonants = word.match(/[bcdfghjklmnpqrstvwxyz]/gi);
      if (consonants && consonants.length > 0 && initials.length < maxLength) {
        const currentLength = initials.length;
        const remaining = maxLength - currentLength;

        initials += consonants.slice(0, remaining).join('');
      }
    }
  };

  Array.from({ length: words.length }).forEach(() => {
    getInitial();
    initials = initials.toUpperCase();

    if (existingInitials.includes(initials) && words.length != 1) {
      words.splice(0, 1);
      initials = '';
    }
  });

  return getInitialsBy3FirstLetter(existingInitials, fullName, maxLength);
};

export const getInitialsBy3FirstLetter = (
  existingInitials: string[],
  fullName: string,
  maxLength: number,
): string => {
  if (!fullName) return '';

  const words = fullName.split(' ');
  let initials = '';

  const getInitial = (word: string): string => {
    return word.slice(0, maxLength).toUpperCase();
  };

  for (const word of words) {
    initials = getInitial(word);

    if (!existingInitials.includes(initials)) {
      break;
    }
  }

  return initials;
};
