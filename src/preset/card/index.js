export default {
  root: {
    class: [
      //Shape
      'rounded-lg',

      //Color
      'bg-surface-0 dark:!bg-grayscale-900',
      'text-general-800 dark:text-general-800',
    ],
  },
  header: {
    class: ['border-b border-surface-200 dark:border-surface-700'],
  },
  body: {
    class: 'flex flex-col gap-3 p-6',
  },
  title: {
    class: 'text-md font-medium',
  },
  subtitle: {
    class: [
      //Spacing
      'mb-1 px-5 md:px-6',

      //Color
      'text-surface-600 dark:text-surface-0/60',
    ],
  },
  content: {
    class: 'flex flex-col gap-3 text-general-800 dark:text-general-100',
  },
  footer: {
    class: [
      'px-5 md:px-6 pt-5 pb-0',
      // 'border-t border-surface-200 dark:border-surface-700',
    ],
  },
};
