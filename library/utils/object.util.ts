// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isEmptyObject = (obj: any): boolean => {
  if (!obj) return true;

  const keys = Object.keys(obj);
  if (!keys.length) return true; // Empty at the top level

  return keys.every((key) => {
    const value = obj[key];

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return (
          !value.length ||
          value.every((val) =>
            typeof val === 'object' ? isEmptyObject(val) : val == null,
          )
        );
      }

      return isEmptyObject(value);
    }

    return value == null;
  });
};

export default isEmptyObject;
