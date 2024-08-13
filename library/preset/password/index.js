export default {
  root: ({ props }) => ({
    class: [
      'w-full',
      'inline-flex relative',
      // 'border-[0.5px] border-general-200 rounded',
      'text-general-800',
      {
        'opacity-60 select-none pointer-events-none cursor-default':
          props.disabled,
      },
    ],
  }),
  input: {
    class: [
      '!bg-primary-500',
      'placeholder:!font-normal',
      // 'bg-white text-general-800 placeholder:text-general-200 placeholder:font-light',
      // 'w-full h-full !max-h-[43px]',
      // 'py-1 px-3 items-center space-x-1',
      // 'flex flex-shrink-0 self-stretch',
      // 'text-xs leading-[133.333%] tracking-[0.24px]',
      // 'rounded shadow-sm',
      // 'appearance-none outline-none focus:ring-primary-500 dark:focus:ring-primary-400',
    ],
  },
  panel: {
    class: [
      // Spacing
      'p-3',

      // Shape
      'border-0 dark:border',
      'shadow-md rounded-md',

      // Colors
      'bg-white dark:bg-white',
      'text-general-800 dark:text-general-800',
      'dark:border-general-800',
    ],
  },
  meter: {
    class: [
      // Position and Overflow
      'overflow-hidden',
      'relative',

      // Shape and Size
      'border-0',
      'h-2',
      'rounded-md',

      // Spacing
      'mb-2',

      // Colors
      'bg-surface-100 dark:bg-surface-700',
    ],
  },
  meterlabel: ({ instance }) => ({
    class: [
      // Size
      'h-full',

      // Colors
      {
        'bg-red-500 dark:bg-red-400/50': instance?.meter?.strength == 'weak',
        'bg-orange-500 dark:bg-orange-400/50':
          instance?.meter?.strength == 'medium',
        'bg-green-500 dark:bg-green-400/50':
          instance?.meter?.strength == 'strong',
      },

      // Transitions
      'transition-all duration-1000 ease-in-out',
    ],
  }),
  showicon: {
    class: [
      'absolute top-[54%] right-3 -mt-2',
      'text-general-200 dark:text-general-200',
      'focus-visible:text-general-500 hover:text-general-500',
    ],
  },
  hideicon: {
    class: [
      'absolute top-[54%] right-3 -mt-2',
      'text-general-200 dark:text-general-200',
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
