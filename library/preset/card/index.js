export default {
  root: {
    class: [
      //Shape
      'rounded-lg p-6',

      'flex flex-col gap-y-3',

      //Color
      'bg-white dark:bg-white',
      'text-grayscale-900 dark:text-grayscale-900',
    ],
  },
  header: {
    class: ['text-2xl font-bold'],
  },
  body: {
    class: 'flex flex-col gap-3',
  },
  title: {
    class: 'text-md font-medium',
  },
  subtitle: {
    class: ['text-base font-semibold'],
  },
  content: {
    class: 'flex flex-col gap-3 text-grayscale-900 dark:text-general-100',
  },
  footer: {
    class: ['inline-flex gap-1 items-center'],
  },
};
