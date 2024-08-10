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
      'font-medium',
      'text-xs',

      // Flexbox and Alignment
      'flex items-center',

      // Spacing
      'pb-1.5 px-2 !h-6',

      // Shape
      'rounded-t-md border-b-2',

      // Colors and Conditions
      {
        'bg-transparent dark:bg-transparent': state.d_activeIndex !== context.index,
        'text-grayscale-600 dark:text-grayscale-600':
          state.d_activeIndex !== context.index,

        'border-primary-500 dark:border-primary-300':
          state.d_activeIndex === context.index,
        'border-grayscale-400 dark:border-grayscale-600':
          state.d_activeIndex !== context.index,
        'text-primary-500 dark:text-primary-300':
          state.d_activeIndex === context.index,
      },

      // States
      'focus-visible:outline-none focus-visible:outline-offset-0',
      'focus-visible:bg-primary-50 dark:focus-visible:bg-primary-50',
      {
        'focus-visible:border-primary-200 dark:focus-visible:border-primary-200 focus-visible:text-primary-400 dark:focus-visible:text-primary-400 ':
          state.d_activeIndex !== context.index,
      },
      {
        // 'hover:bg-surface-0 dark:hover:bg-surface-800/80':
        //   state.d_activeIndex !== context.index,
        // 'hover:border-surface-400 dark:hover:border-surface-600':
        //   state.d_activeIndex !== context.index,
        // 'hover:text-surface-900 dark:hover:text-surface-0':
        //   state.d_activeIndex !== context.index,
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
    class: 'grow border-b-2 border-grayscale-400 dark:border-grayscale-600'
  }
};
