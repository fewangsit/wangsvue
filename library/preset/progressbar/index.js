export default {
  root: ({ props }) => ({
    class: [
      // Position and Overflow
      'relative overflow-hidden',

      // Shape and Size
      'border-0',
      'rounded-full',
      { 'h-1.5': props.mode !== 'indeterminate' && !props.showValue },
      // { 'h-1.5': props.mode !== 'indeterminate' && props.showValue },
      // {
      //   'h-2 bg-surface-100 dark:bg-surface-700 ':
      //     props.mode == 'indeterminate' || !props.showValue,
      // },

      // Before & After (!indeterminate)
      {
        'before:absolute before:w-full before:rounded-full before:h-1.5 before:top-0 before:left-0 before:bottom-0 before:bg-general-100 dark:before:bg-general-100':
          props.mode !== 'indeterminate',
      },
    ],
  }),
  value: ({ props }) => ({
    class: [
      // Flexbox & Overflow & Position
      'rounded-full',
      {
        'absolute flex items-center justify-center':
          props.mode !== 'indeterminate',
      },

      // Colors
      {
        'bg-warning-500':
          (props.value < 100 && props.value > 0 && props.severity != 'danger') ||
          props.severity === 'warning',
        'min-w-[6px] bg-grayscale-500': props.value == 0,
        'bg-success-1000': props.value == 100 || props.severity == 'success',
        'bg-danger-500': props.severity == 'danger',
        'bg-primary-400': props.severity == 'primary',
      },

      // Spacing & Sizing
      'm-0',
      { 'h-1.5 w-0': props.mode !== 'indeterminate' },

      // Shape
      'border-0',

      // Transitions
      {
        'transition-width duration-1000 ease-in-out':
          props.mode !== 'indeterminate',
        'progressbar-value-animate': props.mode == 'indeterminate',
      },

      // Before & After (indeterminate)
      {
        'before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-inherit ':
          props.mode == 'indeterminate',
        'after:absolute after:top-0 after:left-0 after:bottom-0 after:bg-inherit after:delay-1000':
          props.mode == 'indeterminate',
      },
    ],
  }),
  label: {
    class: [
      // Flexbox
      'inline-flex justify-end',
      'absolute inset-0 mr-1 -top-[1.15rem]',

      // Font and Text
      'text-sm text-surface-600 dark:text-surface-0/60',
      'leading-none',
    ],
  },
};
