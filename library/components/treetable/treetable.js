export default {
  root: ({ scrollHeight }) => ({
    'class': [
      'overflow-auto relative',
      'rounded-lg rounded-br-none rounded-bl-none',
      {
        '!overflow-y-auto': !!scrollHeight,
      },
    ],
    'data-wv-name': 'treetable',
    'data-wv-section': 'root',
    'style': `max-height: ${scrollHeight}; scrollbar-width: ${scrollHeight ? 'thin' : 'none'}`,
  }),
  table: {
    'class': [
      'min-w-max w-full',
      '!border-separate !border-spacing-0 border !border-solid !border-primary-100 !border-t-0 !border-l-0 !border-r-0 !rounded-lg',
    ],
    'data-wv-section': 'table',
  },
  tbody: {
    class: [
      '[&_tr:last-of-type>td]:!border-b-0',
      '[&_tr:last-of-type>td:last-child]:!rounded-br-lg',
      '[&_tr:last-of-type>td:first-child]:!rounded-bl-lg',
    ],
  },
  bodyrow: ({ context, props }) => ({
    class: [
      // Color
      'text-genenral-800 text-xs font-normal',
      {
        'bg-transparent': !context.selected,
        'bg-primary-100': context.selected,
      },

      // State
      {
        'focus:outline-none focus:outline-offset-0': props.selectionType,
        'hover:bg-primary-50':
          props.selectionType &&
          props.selectionType !== 'none' &&
          !context.disabled,
      },

      // Transition
      {
        'transition duration-200':
          (props.selectionType && !context.selected) || props.rowHover,
      },

      // Misc
      { 'cursor-pointer': props.selectionType && !context.disabled },
    ],
  }),
  headercell: ({ context }) => {
    return {
      'class': [
        'text-xs font-semibold text-white p-2 text-left cursor-pointer',
        { 'bg-primary-400': !context.sorted || !context.sortable },
        { 'bg-primary-500': context.sorted },
        {
          'hover:bg-primary-500': context.customColumn,
          '!cursor-default': !context.customColumn && !context.sortable,
        },
        'border-0 !border-b border-solid',
        'border-primary-100 dark:border-primary-100',
      ],
      'data-wv-section': 'headercell',
    };
  },
  headercheckbox: {
    'class': '',
    'data-wv-section': 'headercheckbox',
  },
  rowcheckbox: {
    'class': '',
    'data-wv-section': 'rowcheckbox',
  },
  bodycell: {
    'class': [
      'text-xs px-2 py-1.5',
      'border-0 !border-b !border-solid border-primary-100 dark:border-primary-100',
    ],
    'data-wv-section': 'bodycell',
  },
};
