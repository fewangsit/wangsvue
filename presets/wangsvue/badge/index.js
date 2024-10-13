export default {
  root: ({ props }) => ({
    'class': [
      // Alignment
      'inline-flex items-center',

      // Size
      'py-1 px-2',

      // Shape
      'rounded-[50px]',

      // Color
      {
        '!text-general-400 !bg-general-100': props.disabled,
        'text-success-800 bg-success-100': props.severity == 'success',
        'text-primary-800 bg-primary-200':
          props.severity == null || props.severity == 'primary',
        'text-grayscale-900 bg-grayscale-500': props.severity == 'dark',
        'text-warning-600 bg-warning-100': props.severity == 'warning',
        'text-danger-700 bg-danger-200': props.severity == 'danger',
      },
    ],
    'data-wv-name': 'badge',
    'data-wv-section': 'root',
  }),
  input: ({ props, context }) => ({
    class: [
      'text-nowrap whitespace-nowrap font-normal text-xs leading-4 tracking-[0.2488px]',
      {
        'caret-surface-700': props.editable,
        'cursor-default': !!context.badgeTooltip,
      },
    ],
  }),
  removebutton: ({ props }) => ({
    'class': [
      '!p-0 !w-3 !h-3 ml-1',
      {
        '!text-primary-800':
          !props.badgeSeverity || props.badgeSeverity === 'primary',
        '!text-success-800': props.badgeSeverity === 'success',
        '!text-danger-700': props.badgeSeverity === 'danger',
        '!text-warning-600': props.badgeSeverity === 'warning',
        '!text-grayscale-900': props.badgeSeverity === 'dark',
      },
      {
        'text-general-400': props.disabled,
      },
    ],
    'icon-class': 'w-3 h-3',
    'data-wv-section': 'removebutton',
  }),
  group: {
    class: ['flex flex-nowrap items-center gap-1'],
  },
  groupdialog: {
    class: ['flex flex-wrap gap-1'],
  },
};
