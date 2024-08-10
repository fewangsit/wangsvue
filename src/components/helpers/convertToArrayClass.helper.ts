const convertToArrayClass = (classes?: string | string[]): string[] => {
  if (!classes) return [];

  return Array.isArray(classes) ? classes : [classes];
};

export default convertToArrayClass;
