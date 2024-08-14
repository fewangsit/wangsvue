import useToast from './toast.util';
import { formatUserName } from './textFormatter.util';
import filterOptions from './filterOptions.util';
import exportToExcel from './exportToExcel.util';

const getNestedProperyValue = (
  object: object,
  property: string,
): string | boolean | number | object => {
  const properties = property.split('.');
  return properties.reduce((o, p) => o?.[p as keyof object], object);
};

const convertToArrayClass = (classes?: string | string[]): string[] => {
  if (!classes) return [];

  return Array.isArray(classes) ? classes : [classes];
};

const isEmptyObject = (object: object): boolean => {
  if (!object) return true;
  const keys = Object.keys(object);
  return !keys.length || keys.every((key) => object[key] == null);
};

export {
  formatUserName,
  convertToArrayClass,
  getNestedProperyValue,
  useToast,
  exportToExcel,
  filterOptions,
  isEmptyObject,
};
