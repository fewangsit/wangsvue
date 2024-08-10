export default {
  root: ({ props }) => ({
    class: [
      'shadow-sm flex flex-col min-w-[43px] w-max',
      // {
      //   'opacity-60 select-none pointer-events-none cursor-default':
      //     props.disabled,
      // },
    ],
  }),
  button: ({ context }) => ({
    class: [
      'relative',
      // Font
      'text-body-medium',

      // Flex Alignment
      'inline-flex items-center align-bottom text-center',

      // Spacing
      'px-3 py-[5px]',

      // Shape
      'ring-1 ring-inset ring-primary-500 dark:ring-primary-500',
      'first:!rounded-t first:!rounded-b-none',
      'last:!rounded-t-none last:!rounded-b ',

      // Color
      {
        'bg-surface-0 dark:bg-surface-0': !context.active,
        'text-primary-500 dark:text-primary-500': !context.active,
        'text-surface-0 dark:text-surface-0': context.active,
        'bg-primary-500 dark:bg-primary-500': context.active,
      },

      // States
      'focus:outline-none focus:outline-offset-0 focus:z-10',
      {
        'focus:bg-primary-50 dark:focus:bg-primary-50': !context.active,
        'hover:bg-primary-50 dark:hover:bg-primary-50': !context.active,
        'focus:bg-primary-600 dark:focus:bg-primary-600': context.active,
        'hover:bg-primary-600 dark:hover:bg-primary-600': context.active,
      },
      // {
      //   'opacity-60 select-none pointer-events-none cursor-default':
      //     context.disabled,
      // },

      // Transition
      'transition duration-200',

      // Misc
      'cursor-pointer select-none overflow-hidden',
    ],
  }),
  label: {
    class: 'font-semibold',
  },
};
