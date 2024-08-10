export default {
  root: ({ context, props }) => ({
    class: [
      // Position
      'absolute',

      {
        // Add space 4px at the bottom
        'pb-1': context?.top,
        'pt-1': context?.bottom,
        'pl-1': context?.right,
        'pr-1': context?.left,
      },
      // {
      //   'px-1.5':
      //     context?.right ||
      //     context?.left ||
      //     (!context?.right &&
      //       !context?.left &&
      //       !context?.top &&
      //       !context?.bottom),
      //   'py-1.5': context?.top || context?.bottom,
      // },
      '!transition'
    ],
  }),
  arrow: {
    class: 'hidden',
  },
  text: {
    class: [
      // Shape
      'rounded-lg',

      // Background
      'bg-primary-bg-weak dark:bg-primary-50',

      // Spacing
      'px-2 py-1',

      // Typography
      'text-[0.688rem] font-normal leading-[191%] tracking-[0.03em] text-left',

      // Color
      'text-general-800',

      // Misc
      'whitespace-pre-line',
      'break-words',
    ],
  },
};
