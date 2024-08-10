import { commonClasses } from '../inputphonenumber';

export default {
  currency: (ctx) => ({
    'class': [...commonClasses(ctx), 'rounded-l rounded-r-none'],
    'data-ts-section': 'currency',
  }),
  value: (ctx) => ({
    'class': [...commonClasses(ctx), 'rounded-r rounded-l-none -ml-[1px]'],
    'data-ts-section': 'value',
  }),
};
