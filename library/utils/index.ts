import useToast from './toast.util';
import { formatUserName, getInititalName } from './textFormatter.util';
import filterOptions from './filterOptions.util';
import exportToExcel from './exportToExcel.util';
import getImageURL from './getImageURL.util';
import genPlaceholder from './genPlaceholder.util';
import getStatusSeverity from './statusSeverity.util';
import { checkRouteAccess } from './role.util';
import getAttachmentIcon from './getAttachmentIcon.util';

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

export {
  checkRouteAccess,
  formatUserName,
  convertToArrayClass,
  getNestedProperyValue,
  useToast,
  exportToExcel,
  filterOptions,
  isEmptyObject,
  getImageURL,
  genPlaceholder,
  getInititalName,
  getStatusSeverity,
  getAttachmentIcon,
};
