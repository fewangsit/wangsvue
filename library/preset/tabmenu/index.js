export default {
  root: {
    class: 'overflow-x-auto',
    style: 'scrollbar-width: none',
  },
  menu: {
    class: [
      // Flexbox
      'flex flex-1',

      // Size

      // Spacing
      'list-none',
      'p-0 m-0',

      // Colors
      'text-general-100 dark:text-general-400',
    ],
  },
  menuitem: {
    class: 'mr-0',
  },
  action: ({ context, state }) => ({
    class: [
      'relative',

      // Font
      'font-normal',
      'text-xs',

      // Flexbox and Alignment
      'flex items-center',

      // Spacing
      'p-2 pb-1.5 pt-0.5 !h-6',

      // Shape
      'border-b-2',

      // Colors and Conditions
      {
        'bg-transparent dark:bg-transparent':
          state.d_activeIndex !== context.index,
        'text-grayscale-900 dark:text-grayscale-900':
          state.d_activeIndex !== context.index,

        'border-primary-400 dark:border-primary-400':
          state.d_activeIndex === context.index,

        'border-primary-100 dark:border-primary-100':
          state.d_activeIndex !== context.index,
        'text-primary-500 dark:text-primary-500':
          state.d_activeIndex === context.index,
      },

      // States
      'hover:bg-primary-50',
      'focus-visible:outline-none focus-visible:outline-offset-0',
      'focus-visible:bg-primary-50 dark:focus-visible:bg-primary-50',
      {
        'focus-visible:border-primary-200 dark:focus-visible:border-primary-200 focus-visible:text-primary-400 dark:focus-visible:text-primary-400 ':
          state.d_activeIndex !== context.index,
      },

      // Disabled States
      {
        'pointer-events-none': context.item?.disabled,
        'opacity-60': context.item?.disabled,
      },

      // Transitions
      'transition-all duration-200',

      // Misc
      'cursor-pointer select-none text-decoration-none',
      'overflow-hidden',
      'user-select-none',
      '!no-underline',
      'whitespace-nowrap',
    ],
  }),
  icon: {
    class: 'mr-2',
  },
  inkbar: {
    class: 'grow border-b-2 border-primary-100 dark:border-primary-100',
  },
};
