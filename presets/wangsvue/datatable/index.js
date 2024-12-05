export default {
  root: {
    'data-wv-name': 'datatable',
    'data-wv-section': 'root',
  },

  tablewrapper: {
    'class': [
      'overflow-auto relative scrollbar-w-thin',
      'rounded-lg rounded-br-none rounded-bl-none',
    ],
    'data-wv-section': 'tablewrapper',
  },

  scrollheightwrapper: ({ props }) => ({
    'class': [
      'overflow-hidden w-full min-w-max',
      {
        '!overflow-y-auto': !!props.scrollHeight,
      },
    ],
    'style': `scrollbar-width: none; max-height: ${props.scrollHeight}`,
    'data-wv-section': 'scrollheightwrapper',
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
  thead: {
    class: ['sticky top-0 z-50'],
  },
  headerrow: {
    class: ['border-b border-primary-100'],
  },
  bodyrow: ({ context, props }) => ({
    class: [
      'border-b border-general-100 group',
      {
        '!h-[35px]': props.rowHeight === 'fixed', // Style(DXJCiX2e): set table row height to fixed 35px
      },
      // Color
      'text-general-800 text-xs font-normal',
      {
        'bg-transparent': !context.selected,
        'bg-primary-100': context.selected,
      },

      // State
      {
        'focus:outline-none focus:outline-offset-0': props.selectionType,
        // To sets the bg to single action td
        'hover:!bg-primary-50': !context.highlighted,
        'hover:!bg-warning-300 !bg-warning-200': context.highlighted,
      },

      // Transition
      {
        'transition duration-200':
          (props.selectionType && !context.selected) || props.rowHover,
      },

      'px-4 transition-transform',
      { 'select-none': context.dragging, 'select-auto': !context.dragging },
      { '!cursor-grab [&_label]:!cursor-grab': context.draggable },

      // Misc
      { 'cursor-pointer': props.selectionType !== 'none' && !context.disabled },
    ],
  }),
  headercell: ({ context }) => {
    return {
      'class': [
        'text-xs font-semibold text-white p-2 text-left cursor-pointer',
        { 'bg-primary-400': !context.sorted || !context.sortable },
        { 'bg-primary-500': context.sorted },
        {
          'sticky right-0 hover:bg-primary-500': context.customColumn,
          '!cursor-default': !context.customColumn && !context.sortable,
        },
        'border-0 !border-b border-solid',
        'border-primary-100',
      ],
      'data-wv-section': 'headercell',
    };
  },
  headercellcontent: {
    'class': ['inline-flex gap-2 items-center leading-[18px]'],
    'data-wv-section': 'headercellcontent',
  },
  headercellreorderable: {
    'class': ['w-[35px] !py-1'],
    'data-wv-section': 'headercellreorderable',
  },
  draggableicon: {
    class: 'w-[18px] h-[18px] !p-0 !m-0 !cursor-grab [&_label]:!cursor-grab',
  },
  headercheckbox: ({ context }) => ({
    'class': [
      {
        '[&_[data-pc-section=box]]:!border-white [&_[data-pc-section=box]]:!bg-transparent':
          !context.isSelectedAll,
      },
    ],
    'data-wv-section': 'headercheckbox',
  }),
  headercellcheckbox: {
    'class': 'w-[35px] text-center',
    'data-wv-section': 'headercellcheckbox',
  },
  headertoggler: {
    'class': ['w-[40px] text-center !py-1'],
    'data-wv-section': 'headertoggler',
  },
  columnvisibilityicon: {
    class: ['!w-4 !h-4 !mx-auto'],
    info: 'Visibilitas Kolom',
  },
  headertogglerbutton: ({ context }) => ({
    'class': [
      '!p-0 !m-0 !w-auto !h-auto',
      { 'rotate-180': context.isExpandedAll },
      { 'rotate-0': !context.isExpandedAll },
    ],
    'icon-class': 'w-6 h-6 text-white',
    'data-wv-section': 'headertogglerbutton',
  }),

  rowcheckbox: {
    'class': '',
    'data-wv-section': 'rowcheckbox',
  },
  bodycell: {
    'class': [
      'text-xs px-2 py-0.5',
      'border-0 !border-b !border-solid border-primary-100',

      '[&:has([data-wv-section=rowcheckbox])]:text-center',
      '[&:has([data-wv-section=rowcheckbox])]:text-center',
    ],
    'data-wv-section': 'bodycell',
  },
  multirowcontainer: ({ props }) => ({
    class: ['grid grid-cols-1', `grid-rows-${props.attributes.length}`],
  }),
  multirow: ({ context }) => ({
    class: [
      '!h-[35px] flex items-center px-2',
      { '!border-t border-primary-100 !border-solid': !context.firstIndex },
    ],
  }),
  rowtogglerbutton: ({ context }) => ({
    'class': [
      '!p-0 !m-0 !w-auto !h-auto',
      { 'rotate-180': context.isRowExpanded },
      { 'rotate-0': !context.isRowExpanded },
    ],
    'icon-class': 'w-6 h-6',
    'data-wv-section': 'rowtogglerbutton',
  }),

  childrowheader: {
    'class': 'font-semibold text-xs',
    'data-wv-section': 'childrowheader',
  },

  celleditableelement: {
    'class': [
      'focus:px-2',
      'w-full inline-block py-2 focus:outline-grayscale-600 focus:outline-1',
    ],
    'data-wv-section': 'celleditableelement',
  },

  rowsingleactioncell: ({ props, context }) => ({
    'class': [
      'w-[35px]',
      {
        'sticky bg-white': props.useOption,
        '!bg-primary-100': context.selected,
        'group-hover:!bg-primary-50': !context.highlighted,
        'group-hover:!bg-warning-300 !bg-warning-200': context.highlighted,
      },
    ],
    'data-wv-section': 'rowsingleactioncell',
  }),

  singleactionwrapper: {
    'class': ['relative w-full h-full flex items-center justify-center'],
    'data-wv-section': 'singleactionwrapper',
  },

  singleactionbutton: ({ props }) => ({
    'class': [
      {
        'pointer-events-none !border-general-100 [&>i]:text-general-200':
          props.disableAllRows,
      },
      { 'pointer-events-auto': !props.disableAllRows },
    ],
    'tooltip': 'Aksi',
    'data-wv-section': 'singleactionbutton',
  }),

  nodatalottiewrapper: {
    'class': 'w-full p-4 flex items-center justify-center',
    'data-wv-section': 'nodatalottiewrapper',
  },

  nodatalottie: {
    'class': 'w-44 h-auto',
    'data-wv-section': 'nodatalottie',
  },

  loadingtablewrapper: {
    'class': 'sticky left-0 w-full p-4 flex items-center justify-center',
    'data-wv-section': 'loadingtablewrapper',
  },

  loadingtablelottie: {
    'class': 'w-20 h-auto',
    'data-wv-section': 'loadingtablelottie',
  },

  paginator: ({ context }) => ({
    'current-page-report-template': context.totalRecords
      ? 'Menampilkan {first} - {last} dari {totalRecords}'
      : 'Tidak ditemukan data',

    'class': 'sticky left-0 bottom-0',

    'template':
      'FirstPageLink PrevPageLink PageLinks JumpToPageInput NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
  }),
};
