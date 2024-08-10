export default {
  root: {
    class: [
      'relative',

      'w-4 h-4',
      'shrink-0',

      // Alignment
      'inline-flex',
      'align-bottom',

      // Transitions
      'transition-all',
      'duration-200',
    ],
  },
  box: ({ props, context }) => ({
    class: [
      // Alignment
      'flex',
      'items-center',
      'justify-center',

      // Size
      'w-full',
      'h-full',
      
      // Shape
      'rounded',
      'border-2',

      // Colors
      'text-line',
      {
        'border-general-100 bg-surface-0 dark:border-general-300 dark:bg-grayscale-800':
          !context.checked && !props.disabled,
        'border-primary bg-primary dark:border-primary dark:bg-primary':
          context.checked && !props.disabled,
      },

      {
        'ring-2 ring-primary dark:ring-primary':
          !props.disabled && context.focused,
      },

      // States
      {
        'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-primary dark:peer-focus-visible:ring-primary':
          !props.disabled,
        'cursor-default bg-general-50 border-general-200 dark:bg-general-50 dark:border-general-200':
          props.disabled && !context.checked,
        'bg-general-200 dark:bg-general-200 border-general-200 dark:border-general-200':
          props.disabled && context.checked,
      },

      // Icon state
      {
        '[&_i]:bg-transparent': props.disabled && !context.checked,
        '[&_i]:text-white': context.checked,
        '[&_i]:text-transparent': !context.checked,
      },

      // Transitions
      'transition-all',
      'duration-200',
    ],
  }),
  input: {
    class: [
      'peer',

      // Size
      'w-full ',
      'h-full',

      // Position
      'absolute',
      'top-0 left-0',
      'z-10',

      // Spacing
      'p-0',
      'm-0',

      // Shape
      'rounded',
      'border',

      // Shape
      'opacity-0',
      'rounded-md',
      'outline-none',
      // 'border-2 border-surface-300 dark:border-surface-700',

      // Misc
      'appareance-none',

      // Transitions
      'transition-all',
      'duration-200',

      // Misc
      'cursor-pointer',
    ],
  },
  icon: {
    class: [
      // Font
      'text-normal',

      // Size
      'w-3',
      'h-3',

      // Colors
      // 'text-white',

      // Transitions
      'transition-all',
      'duration-200',
    ],
  },
};
