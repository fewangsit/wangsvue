const isArrayIncluded = (
  smallArray: string[],
  largeArray: string[],
): boolean => {
  return smallArray.every((element) => largeArray.includes(element));
};

export { isArrayIncluded };
