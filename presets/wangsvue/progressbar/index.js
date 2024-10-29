export default {
  root: ({ props }) => ({
    'class': [
      {
        'grid items-center gap-2': props.mode === 'determinate',
        'grid-cols-[max-content,auto]': props.valuePosition === 'left-side',
        'grid-cols-[auto,max-content]': props.valuePosition === 'right-side',
      },
    ],
    'data-wv-name': 'progressbar',
    'data-wv-section': 'root',
  }),

  container: ({ props }) => ({
    'class': [
      // Position and Overflow
      'relative overflow-hidden',

      {
        'order-2': props.valuePosition === 'left-side',
        'order-1': props.valuePosition === 'right-side',
      },

      // Shape and Size
      {
        'h-3.5':
          props.mode !== 'indeterminate' && props.valuePosition === 'inside',
        'h-1.5':
          props.mode === 'indeterminate' || props.valuePosition !== 'inside',
      },

      // Indeterminate Animation Classes
      {
        'bg-general-100 m-0 border-0 progressbar-value-animate before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-primary-400 after:absolute after:top-0 after:left-0 after:bottom-0 after:bg-inherit after:delay-1000':
          props.mode === 'indeterminate',
      },

      'border-0',
      'rounded-full',
      'bg-general-100',
    ],
    'data-wv-section': 'container',
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
          (props.value < 100 &&
            props.value > 0 &&
            props.severity !== 'danger') ||
          props.severity === 'warning',
        'min-w-[6px] !bg-grayscale-500': +props.value === 0,
        'bg-success-1000': props.severity === 'success' || +props.value === 100,
        'bg-danger-500': props.severity === 'danger',
        'bg-primary-400': props.severity === 'primary',
      },

      // Spacing & Sizing
      'm-0',
      {
        'h-1.5 w-0':
          props.mode !== 'indeterminate' && props.valuePosition !== 'inside',
        'h-3.5 w-0':
          props.mode !== 'indeterminate' && props.valuePosition === 'inside',
      },

      // Shape
      'border-0',

      // Transitions
      {
        'transition-width duration-1000 ease-in-out':
          props.mode !== 'indeterminate',
        'progressbar-value-animate': props.mode === 'indeterminate',
      },

      // Before & After (indeterminate)
      {
        'before:absolute before:top-0 before:left-0 before:bottom-0 before:bg-inherit ':
          props.mode === 'indeterminate',
        'after:absolute after:top-0 after:left-0 after:bottom-0 after:bg-inherit after:delay-1000':
          props.mode === 'indeterminate',
      },
    ],
  }),

  label: ({ props }) => ({
    class: [
      // Flexbox
      'inline-flex justify-end',

      // Font and Text
      'font-medium text-[14px] leading-4',
      'leading-none',

      {
        'absolute inset-0 mr-1 !text-xs': props.valuePosition === 'inside',
        'order-1': props.valuePosition === 'left-side',
        'order-2': props.valuePosition === 'right-side',
      },
    ],
  }),
};
