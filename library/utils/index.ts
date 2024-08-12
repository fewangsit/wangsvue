import useToast from './toast.util';
import { formatUserName } from './textFormatter.util';

const getNestedProperyValue = (
  object: object,
  property: string,
): string | boolean | number | object => {
  const properties = property.split('.');
  return properties.reduce((o, p) => o?.[p as keyof object], object);
};

export { formatUserName, getNestedProperyValue, useToast };
