export default {
  root: {
    'class': 'flex gap-2 items-center',
    'data-wv-name': 'buttonbulkaction',
    'data-wv-section': 'root',
  },

  menu: {
    'id': 'bulkaction-overlay-menu',
    'class': 'flex gap-2 items-center',
    'data-wv-section': 'menu',
  },

  selectionmessage: {
    'class': 'text-xs text-grayscale-900 cursor-default whitespace-nowrap',
    'data-wv-section': 'selectionmessage',
  },

  buttonselectall: ({ context }) => ({
    'class': [
      '!px-1.5 !py-1 -ml-1.5 -mr-1.5 !text-xs',
      { 'pointer-events-none': context.selectedAll },
    ],
    'data-wv-section': 'buttonselectall',
  }),

  bulkactiontoggle: {
    'data-wv-section': 'bulkactiontoggle',
  },

  buttonclearselection: {
    'class': '!p-0 !w-6 !h-6 [&_.icon]:!w-5 [&_.icon]:!h-5',
    'data-wv-section': 'buttonclearselection',
  },
};
