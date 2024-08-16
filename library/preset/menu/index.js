export default {
  root: {
    class: [
      // Position

      // Transition
      'transition-transform',
      'z-50',

      // Sizing and Shape
      'w-max min-w-52',
      'min-w-[196px]',
      'max-h-[90vh] overflow-y-auto',
      'rounded-md',
      'border-[0.5px] border-solid border-grayscale-900',
      'max-w-[400px]',

      'translate-y-1',
      // Spacing
      // 'p-1.5',

      'shadow',

      'overflow-hidden',

      // Colors
      'bg-white dark:bg-white',
      'text-general-800 dark:text-general-100',
      // 'ring-1 ring-line dark:ring-line',
    ],
  },
  menu: {
    class: [
      // Spacings and Shape
      'list-none',
      'm-0',
      'p-0',
      'outline-none',
    ],
  },
  start: {
    class: ['flex justify-end', 'py-[3px] px-4'],
  },
  menuitem: {
    class: [
      // Space
      // Misc
      'cursor-pointer',
    ],
  },
  content: ({ context }) => ({
    class: [
      // Space
      // 'px-2',

      'w-full',

      // Shape
      'rounded-md',

      // Colors
      'text-inherit dark:text-inherit',
      // {
      //   'text-surface-700 dark:text-surface-0': !context.focused,
      //   'bg-surface-100 text-primary-500 dark:bg-surface-300/10 dark:text-primary-400':
      //     context.focused,
      // },

      // Transitions
      'transition-shadow',
      'duration-200',

      // States
      // 'hover:text-primary-600 dark:hover:text-primary-400',
      // 'hover:bg-surface-100 dark:hover:bg-surface-400/10',
    ],
  }),
  action: {
    class: [
      'flex items-center justify-start gap-2',

      'px-4 py-[7px]',
      'hover:bg-primary-50/80',

      'text-xs',
      // 'relative',

      // Font
      // 'font-semibold',

      // Flexbox
      // 'flex',
      // 'items-center',

      // Spacing
      // 'py-2',
      // 'px-3',

      // Misc
      'no-underline',
      'overflow-hidden',
      'cursor-pointer',
      'select-none',
    ],
  },
  icon: {
    class: [
      // Spacing
      'w-4 h-4',
    ],
  },
  label: {
    class: ['text-inherit', 'leading-4'],
  },
  submenuheader: {
    class: [
      // Font
      'text-inherit',

      // Spacing
      // 'm-0 ',
      // 'py-1',
      // 'px-3',

      // Shape
      // 'rounded-tl-none',
      // 'rounded-tr-none',

      // Colors
      // 'bg-white dark:bg-white',
      // 'text-general-800 dark:text-general-800',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
};
