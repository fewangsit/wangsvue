import { ringClass } from '../global.js';

export default {
  root: ({ context, props }) => ({
    'class': [
      // Font
      'font-normal placeholder:text-general-200 placeholder:!font-normal text-xs',

      'w-full',
      {
        'resize-none': props.autoResize,
        'resize': !props.autoResize,
      },

      props.inputClass,
      // Spacing
      'm-0',
      'py-1 px-3',

      // Shape
      'rounded',
      'appearance-none',

      ...ringClass,
      {
        '!ring-danger-500': context.invalidInput,
      },

      // // States
      {
        'bg-transparent text-general-800': !context.disabled,
        'bg-general-50 text-general-200': context.disabled,
      },
      'focus-visible:outline-none',

      // Misc
      'appearance-none',
      'transition-colors duration-200',
    ],
    'style': `min-height: ${props.rows * 26}px`,
    'data-wv-name': 'textarea',
    'data-wv-section': 'root',
  }),
};
