import { commonClasses } from '../inputphonenumber';

export default {
  currency: (ctx) => ({
    'class': [...commonClasses(ctx), 'rounded-l rounded-r-none h-[30px]'],
    'data-wv-section': 'currency',
  }),
  value: (ctx) => ({
    'class': [...commonClasses(ctx), 'rounded-r rounded-l-none -ml-[1px]'],
    'data-wv-section': 'value',
  }),
};
