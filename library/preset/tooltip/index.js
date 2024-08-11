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

      '!transition',
    ],
  }),
  arrow: {
    class: 'hidden',
  },
  text: {
    class: [
      // Shape
      'rounded-[10px]',

      // Background
      'bg-white',

      // Spacing
      'px-3 py-1',

      // Typography
      'text-xs font-normal leading-4 text-left',

      // Color
      'text-grayscale-900',

      // Misc
      'shadow-[0px_4px_4px_0px_#00000040]',
      'whitespace-pre-line',
      'break-words',
    ],
  },
};
