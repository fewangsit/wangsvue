export default {
  root: ({ props }) => ({
    class: [
      //Size and Shape
      'w-full max-w-[496px]',

      // Positioning
      {
        '-translate-x-2/4':
          props.position == 'top-center' || props.position == 'bottom-center',
      },
    ],
    style: `z-index: ${props.baseZIndex}`,
  }),
  container: ({ props }) => ({
    class: [
      'border-0 mt-6',
      'rounded-[7px] w-full',
      'shadow-lg',
      // Colors
      {
        'border-success-600 text-white bg-success-500': props.message.severity === 'success',
        'border-danger text-white bg-danger-500': props.message.severity === 'error',
        'border-primary-500 text-primary-500 bg-primary-50': props.message.severity === 'info',
      },
    ],
  }),
  content: {
      class: 'flex items-center py-3 px-3 text-inherit gap-2',
  },
  icon: {
    class: 'hidden',
  },
  text: {
    class: [
      // Font and Text
      'text-xs leading-4 font-normal tracking-[0.02em] text-inherit',
      'flex-1',
    ],
  },
  summary: {
    class: 'font-medium block',
  },
  detail: {
    class: 'text-inherit',
  },
  closebutton: ({ props }) => ({
    class: [
      // Flexbox
      'flex items-center justify-center',

      // Size
      'w-6 h-6',

      // Spacing and Misc
      'ml-auto relative',

      // Shape
      'rounded-full',

      // Colors
      'bg-transparent',
      {
        'text-white dark:text-white': props.message.severity === 'success',
        'text-danger dark:text-danger': props.message.severity === 'error',
        'text-primary-500 dark:text-primary-500': props.message.severity === 'info',
      },

      // Transitions
      'transition duration-200 ease-in-out',

      // States
      // {
      //   'hover:bg-success-100 dark:hover:bg-success-100': props.message.severity === 'success',
      //   'hover:bg-danger-100 dark:hover:bg-danger-100': props.message.severity === 'error',
      //   'hover:bg-primary-100 dark:hover:bg-primary-100': props.message.severity === 'info'
      // },

      // Misc
      'overflow-hidden',
    ],
  }),
  closeicon: {
    class: [
      // Sizing and Spacing
      'w-3 h-3',
      'shrink-0',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 translate-y-2/4',
    enterActiveClass: 'transition-[transform,opacity] duration-300',
    leaveFromClass: 'max-h-[1000px]',
    leaveActiveClass:
      '!transition-[max-height_.45s_cubic-bezier(0,1,0,1),opacity_.3s,margin-bottom_.3s] overflow-hidden',
    leaveToClass: 'max-h-0 opacity-0 mb-0',
  },
};
