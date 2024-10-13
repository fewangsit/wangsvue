export default {
  root: {
    'class': [
      'flex gap-[5px] items-center text-left h-[21px]',
      'text-grayscale-900 ',
      'text-xs font-normal leading-none',
    ],
    'data-wv-name': 'breadcrumb',
    'data-wv-section': 'root',
  },

  item: ({ context }) => ({
    'class': {
      'font-semibold': context.lastItem,
      'text-primary-400': context.hasRoute && !context.firstItem,
    },
    'data-wv-section': 'breadcrumb-menu',
  }),

  itemlink: {
    'class': 'cursor-pointer text-primary',
    'data-wv-section': 'itemlink',
  },

  separator: {
    'content': '>',
    'data-wv-section': 'separator',
  },
};
