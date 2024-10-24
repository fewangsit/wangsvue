export default {
  root: ({ props, parent }) => ({
    class: [
      // Font
      {
        'text-sm': props.size == null || props.size == 'normal',
        'text-lg': props.size == 'large',
        'text-xl': props.size == 'xlarge',
      },

      // Alignments
      'inline-flex items-center justify-center',
      'shrink-0',
      'relative',

      // Sizes
      {
        'h-[30px] w-[30px]': props.size == null || props.size == 'normal',
        'w-12 h-12': props.size == 'large',
        'w-16 h-16': props.size == 'xlarge',
      },
      { '-ml-4': parent.instance.$style?.name == 'avatargroup' },

      // Shapes
      {
        'rounded-lg': props.shape == 'square',
        'rounded-full': props.shape == 'circle',
      },
      { 'border-[0.5px]': parent.instance.$style?.name == 'avatargroup' },

      // Colors
      'bg-general-300',
      {
        'border-gray-100': parent.instance.$style?.name == 'avatargroup',
      },
      'text-white',
    ],
  }),
  image: {
    class: 'h-full w-full rounded-full',
  },
};
