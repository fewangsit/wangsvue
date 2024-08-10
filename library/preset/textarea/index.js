import { ringClass } from '../global';

export default {
  root: ({ context }) => ({
    class: [
      // Font
      'font-medium placeholder:text-general-200 text-xs placeholder:font-light leading-[16.39px] tracking-[0.24px]',

      'w-full',

      // Spacing
      'm-0',
      'py-1 px-3',

      // Shape
      'rounded',
      'appearance-none',
      ...ringClass,
      // // States
      {
        'bg-transparent text-general-800 dark:text-general-100':
          !context.disabled,
        'bg-general-50 dark:bg-general-50 text-general-200 dark:text-general-200':
          context.disabled,
      },
      'focus-visible:outline-none',

      // Misc
      'appearance-none',
      'transition-colors duration-200',
    ],
  }),
};
