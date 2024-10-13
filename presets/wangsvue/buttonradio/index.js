export default {
  root: {
    'class': 'flex items-center w-max gap-1 cursor-pointer text-xs',
    'data-wv-name': 'buttonradio',
    'data-wv-section': 'root',
  },
  wrapper: ({ props }) => ({
    class: [
      'relative',

      // Flexbox & Alignment
      'flex items-center justify-center',

      // Size
      'w-4 h-4',

      // Shape
      'border-2',
      'rounded-full',

      // Colors
      {
        'bg-white':
          props.value !== props.modelValue &&
          props.value !== undefined &&
          !props.disabled,
        'bg-general-50': props.disabled,
        'border-general-100':
          props.value !== props.modelValue &&
          props.value !== undefined &&
          !props.disabled,
        'border-primary-500':
          props.value == props.modelValue &&
          props.value !== undefined &&
          !props.disabled,
        'border-general-200': props.disabled,
      },

      // Misc
      'cursor-pointer',
    ],
  }),
  box: ({ props }) => ({
    class: [
      // Flexbox
      'flex justify-center items-center',

      // Size
      'w-2 h-2',
      'text-sm',
      'font-medium',

      // Shape
      // 'border-2',
      'rounded-full',

      // Transition
      'transition duration-200 ease-in-out',

      // Colors
      {
        'border-general-100':
          props.value !== props.modelValue && props.value !== undefined,
        'border-primary-500':
          props.value == props.modelValue &&
          props.value !== undefined &&
          !props.disabled,
        'bg-primary-500':
          props.value == props.modelValue &&
          props.value !== undefined &&
          !props.disabled,
        'bg-general-200':
          props.value == props.modelValue &&
          props.value !== undefined &&
          props.disabled,
      },

      // States
      {
        'outline-none outline-offset-0': !props.disabled,
        'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-0 peer-focus-visible:ring-primary-500':
          !props.disabled,
        // 'opacity-60 cursor-default': props.disabled,
      },
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
      'opacity-0',
      'rounded-md',
      'outline-none',
      // 'border-2 border-surface-300',

      // Misc
      'appearance-none',
      { 'cursor-default': props.disabled, 'cursor-pointer': !props.disabled },
    ],
  }),
  icon: {
    class: 'hidden',
  },
};
