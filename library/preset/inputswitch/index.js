export default {
  root: ({ props }) => ({
    class: [
      // Alignments
      'inline-flex relative',
      'shrink-0',

      // Shape
      'rounded-2xl',

      // Size
      'h-4 w-8',

      // Misc
      'cursor-pointer',

      // States
      {
        'select-none pointer-events-none cursor-default': props.disabled,
      },
    ],
  }),
  slider: ({ props }) => ({
    class: [
      // Position
      'absolute top-0 left-0 right-0 bottom-0',

      // Shape
      'rounded-2xl',

      // Before:
      'before:absolute before:top-1/2',
      'before:-mt-[6px] before:ml-0.5',
      'before:h-3 before:w-3',
      'before:rounded-full',
      'before:duration-200 before:transition before:ease-in-out',
      'before:shadow',
      {
        'before:bg-general-100 before:dark:bg-general-100':
          props.modelValue !== props.trueValue,
        'before:bg-white before:dark:bg-white':
          props.modelValue == props.trueValue,
      },
      {
        'before:transform before:translate-x-3.5':
          props.modelValue == props.trueValue,
      },

      // Colors
      'border',
      {
        'border-general-100': props.modelValue !== props.trueValue,
        'border-transparent': props.modelValue == props.trueValue,
      },
      {
        'bg-white dark:bg-white':
          props.modelValue !== props.trueValue && !props.disabled,
        'bg-primary-500 dark:bg-primary-500':
          props.modelValue == props.trueValue && !props.disabled,
        'bg-general-200 dark:bg-general-200': props.disabled,
      },

      // States
      // {
      //   'peer-hover:bg-surface-300 dark:peer-hover:bg-surface-600 ':
      //     !(props.modelValue == props.trueValue) && !props.disabled,
      // },
      // {
      //   'peer-hover:bg-primary-600 dark:peer-hover:bg-surface-300 ':
      //     props.modelValue == props.trueValue && !props.disabled,
      // },
      'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-primary-400',

      // Transition
      'transition-colors duration-200',

      // Misc
      'cursor-pointer',
    ],
  }),
  input: ({ props }) => ({
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
      'border-2 border-surface-300 dark:border-surface-700',

      // Misc
      'appareance-none',
      {
        'cursor-default': props.disabled,
        'cursor-pointer': !props.disabled,
      },
    ],
  }),
};
