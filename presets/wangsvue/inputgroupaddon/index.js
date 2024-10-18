export default {
  root: ({ props }) => ({
    'class': [
      'inputgroupaddon', // Removing this class will causes bug style.
      // Flex
      'inline-flex items-center justify-center',

      // Shape
      'first:rounded-tl first:rounded-bl',
      'last:rounded-tr last:rounded-br',
      'ring-inset',
      // 'border-y',
      // 'border-l',

      // Space
      'px-3 gap-3',

      // Size
      'w-max',

      // Font
      'text-general-800',
      'text-xs font-medium leading-none tracking-tight',

      // Color
      { 'bg-general-50': props.addonVariant === 'filled' },
      {
        '!text-general-200': props.disabled,
        '!px-2': props.showButtons,
      },
    ],
    'data-addon-variant': props.addonVariant, // Used in inputgroup to set styling
  }),
};
