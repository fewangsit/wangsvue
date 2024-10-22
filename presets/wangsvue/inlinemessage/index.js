export default {
  root: ({ props }) => ({
    class: [
      'rounded-md p-3',
      'w-full',
      {
        'bg-success-50 text-success-500': props.severity == 'success',
        'bg-danger-50 text-danger-500': props.severity == 'error',
        'bg-grayscale-50 text-general-800': props.severity == 'secondary',
      },
    ],
  }),
  icon: {
    class: 'hidden',
  },
  text: {
    class: [
      // Layout
      'w-full flex gap-3 flex-col',

      // Font and Text
      'text-[12px] leading-[normal] tracking-[0.24px]',
      'font-medium',
    ],
  },
};
