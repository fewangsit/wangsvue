export default {
  root: {
    class: [
      'relative',

      'w-4 h-4',

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
      'text-surface-0',
      {
        'border-general-100 bg-surface-0':
          !context.active && !props.disabled,
        'border-primary-500 bg-primary-500':
          context.active && !props.disabled,
      },

      {
        'ring-2 ring-primary-500':
          !props.disabled && context.focused,
        'cursor-default': props.disabled,
      },

      // States
      {
        'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-primary':
          !props.disabled,
        'cursor-default bg-general-50 border-general-200':
          props.disabled && !context.active,
        'bg-general-200 border-general-200':
          props.disabled && context.active,
      },

      // Transitions
      'transition-colors',
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
      'border-2 border-surface-300',

      // Misc
      'appareance-none',
      'cursor-pointer',
    ],
  },
  checkicon: {
    class: [
      // Font
      'text-normal',

      // Size
      'w-3',
      'h-3',

      // Colors
      'text-surface-0',

      // Transitions
      'transition-all',
      'duration-200',
    ],
  },
  uncheckicon: {
    class: [
      // Font
      'text-normal',

      // Size
      'w-3',
      'h-3',

      // Colors
      'text-surface-0',

      // Transitions
      'transition-all',
      'duration-200',
    ],
  },
};
