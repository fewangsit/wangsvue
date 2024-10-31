const isIntersect = (arr1: string[], arr2: string[]): boolean => {
  return arr1.some((value) => arr2.includes(value));
};

export default isIntersect;
