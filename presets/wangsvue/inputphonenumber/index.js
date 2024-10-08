export const commonClasses = ({ isFirefoxBased, invalidInput }) => [
  { 'ring-[1px]': isFirefoxBased, 'ring-[0.5px]': !isFirefoxBased },
  { '!ring-danger-500': invalidInput },
  'ring-inset',
  'ring-general-400',
  '[&:has(:focus)]:bg-none',
  '[&:has(:focus)]:ring-primary-400',
  'bg-white',
  'z-[0] [&:has(:focus)]:z-[12]',
];

export default {
  dialcode: (ctx) => ({
    class: [...commonClasses(ctx), 'rounded-l rounded-r-none'],
  }),
  inputnumber: (ctx) => ({
    class: [...commonClasses(ctx), 'rounded-r rounded-l-none -ml-[1px]'],
  }),
};
