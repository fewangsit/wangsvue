import presetCheckbox from '../checkbox';

export default {
  root: ({ props }) => ({
    class: [
      'relative',

      // Flex & Alignment
      { 'flex flex-col': props.scrollable && props.scrollHeight === 'flex' },

      // Size
      { 'h-full': props.scrollable && props.scrollHeight === 'flex' },

      // Shape
      // 'border-spacing-0 border-separate',
    ],
  }),
  loadingoverlay: {
    class: [
      // Position
      'absolute',
      'top-0 left-0',
      'z-[41]',

      // Flex & Alignment
      'flex items-center justify-center',

      // Size
      'rounded-lg',
      'w-full h-full',

      // Color
      'bg-surface-100/40 dark:bg-surface-800/40',

      // Transition
      'transition duration-200',
    ],
  },
  loadingicon: {
    class: 'w-8 h-8 animate-spin',
  },
  wrapper: ({ props, parent }) => ({
    class: [
      {
        'relative': props.scrollable,
        'flex flex-col grow': props.scrollable && props.scrollHeight === 'flex',
      },

      // Size
      { 'h-full': props.scrollable && props.scrollHeight === 'flex' },

      // Shape
      'rounded-lg',
      'rounded-br-none rounded-bl-none',
    ],
  }),
  header: ({ props }) => ({
    class: [
      'font-bold',

      // Shape
      // props.showGridlines ? 'border-b' : 'border-b border-x-0',

      // Spacing
      'py-1.5 px-[9.6px]',

      // Color
      'bg-surface-0 dark:bg-surface-800',
      // 'border-surface-300 dark:border-surface-600',
      'text-surface-700 dark:text-white/80',
    ],
  }),
  table: {
    class:
      'w-full !border-separate !border-spacing-0 border !border-solid !border-primary-100 !border-t-0 !border-l-0 !border-r-0 !rounded-lg',
  },
  thead: ({ context }) => ({
    class: [
      {
        'top-0 z-40 !sticky': context.scrollable,
      },
    ],
  }),
  tbody: ({ instance, context }) => ({
    class: [
      // 'border-t border-surface-300 dark:border-surface-600',
      '[&_tr:last-of-type>td]:!border-b-0',
      '[&_tr:last-of-type>td:last-child]:!rounded-br-lg',
      '[&_tr:last-of-type>td:first-child]:!rounded-bl-lg',
      {
        'sticky z-20 font-semibold': instance.frozenRow && context.scrollable,
      },
    ],
  }),
  tfoot: ({ context }) => ({
    class: [
      {
        'bottom-0 z-0': context.scrollable,
      },
    ],
  }),
  footer: {
    class: [
      'font-semibold',

      // Shape
      // 'border-t-0 border-t border-x-0',

      // Spacing
      'p-4',

      // Color
      'bg-surface-0 dark:bg-surface-800',
      // 'border-surface-200 dark:border-surface-700',
      'text-surface-700 dark:text-white/80',
    ],
  },
  column: {
    headercell: ({ context, props }) => ({
      class: [
        'font-semibold',
        'text-xs',
        'text-white dark:text-white',

        // Position
        { '!sticky z-20 border-b': props.frozen || props.frozen === '' },
        { relative: context.resizable },
        {
          'hover:bg-primary-500 active:bg-primary-500 cursor-pointer transition duration-200':
            props.frozen || props.frozen === '',
        },

        // Alignment
        'text-left',

        // Shape
        { 'border-r last:border-r-0': context?.showGridlines },
        'border-0 !border-b border-solid',
        'border-primary-100 dark:border-primary-100',
        // Spacing
        'p-2',
        // context?.size === 'small'
        //   ? 'py-2.5 px-2'
        //   : context?.size === 'large'
        //     ? 'py-5 px-4'
        //     : 'py-1.5 px-[9.6px]',

        // Color
        'bg-primary-400 dark:bg-primary-400 text-white dark:text-white',
        {
          'bg-primary-500':
            (props.sortable === '' || props.sortable) && context.sorted,
        },
        // (props.sortable === '' || props.sortable) && context.sorted
        //   ? 'dark:text-white'
        //   : 'dark:text-white dark:bg-primary-400',

        // States
        // 'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

        // Transition
        {
          'transition duration-200': props.sortable === '' || props.sortable,
        },

        // Misc
        { 'cursor-pointer': props.sortable === '' || props.sortable },
        {
          'overflow-hidden space-nowrap bg-clip-padding': context.resizable,
        },
      ],
    }),
    headercontent: {
      class: 'flex items-center select-none gap-1',
    },
    headertitle: {
      class: 'whitespace-nowrap',
    },
    sort: ({ context }) => ({
      class: [
        'text-white dark:text-white',
        // context.sorted ? 'text-primary-500' : 'text-surface-700',
        // context.sorted ? 'dark:text-primary-400' : 'dark:text-white/80',
      ],
    }),
    bodycell: ({ props, context, parent }) => ({
      class: [
        '[&[data-p-frozen-column=true]:empty]:bg-transparent',
        //Position
        { sticky: parent.instance.frozenRow },
        { sticky: props.frozen || props.frozen === '' },
        // 'text-white dark:text-white',
        'text-xs font-normal text-general-800',
        'overflow-hidden',
        // Alignment
        'text-left',
        // {
        //   'flex items-center justify-center':
        //     parent.instance.frozenRow || props.frozen || props.frozen === '',
        // },

        'border-0 !border-b !border-solid border-primary-100 dark:border-primary-100',
        { 'last:border-r-0 border-r border-b': context?.showGridlines },
        {
          'bg-white':
            parent.instance.frozenRow ||
            props.frozen ||
            (props.frozen === '' && !parent.props.selected),
          'bg-primary-50':
            (parent.instance.frozenRow ||
              props.frozen ||
              props.frozen === '') &&
            parent.props.selected,
        },

        // Spacing
        'py-[4.5px] px-2 min-h-6',

        // Color
        // 'border-primary-100 dark:border-primary-100',

        // Misc
        'space-nowrap text-nowrap w-max whitespace-nowrap',
      ],
    }),
    footercell: ({ context }) => ({
      class: [
        // Font
        'font-bold',

        // Alignment
        'text-left',

        // Shape
        { 'border-r last:border-r-0': context?.showGridlines },
        // 'border-0 border-t border-solid',

        // Spacing
        context?.size === 'small'
          ? 'p-2'
          : context?.size === 'large'
            ? 'p-5'
            : 'p-4',

        // Color
        // 'border-surface-200 dark:border-surface-700',
        'text-surface-700 dark:text-white/80',
        'bg-surface-0 dark:bg-surface-800',
      ],
    }),
    sorticon: {
      class: 'w-[9px] h-[9px]',
    },
    sortbadge: {
      class: [
        // Flex & Alignment
        'flex items-center justify-center align-middle',

        // Shape
        'rounded-full',

        // Size
        'w-[12px] leading-[1.143rem]',

        // Spacing
        'ml-2',

        // Color
        'text-primary-700 dark:text-white',
        'bg-primary-50 dark:bg-primary-400/30',
      ],
    },
    columnfilter: {
      class: 'inline-flex items-center ml-auto',
    },
    filteroverlay: {
      class: [
        // Position
        'absolute top-0 left-0',
        'mt-2',

        // Shape
        'border-0',
        'rounded-md',
        'shadow-md',

        // Size
        'min-w-[12.5rem]',

        // Color
        'bg-surface-0 dark:bg-surface-800',
        'text-surface-800 dark:text-white/80',
        'ring-1 ring-inset ring-surface-300 dark:ring-surface-700',
      ],
    },
    filtermatchmodedropdown: {
      root: ({ state }) => ({
        class: [
          // Display and Position
          'flex',
          'relative',

          // Spacing
          'mb-2',

          // Shape
          'w-full',
          'rounded-md',
          'shadow-sm',

          // Color and Background
          'bg-surface-0 dark:bg-surface-900',
          {
            'ring-1 ring-inset ring-surface-300 dark:ring-surface-700':
              !state.focused,
          },

          // Transitions
          'transition-all',
          'duration-200',

          // States
          {
            'outline-none outline-offset-0 ring-2 ring-primary-500 dark:ring-primary-400':
              state.focused,
          },

          // Misc
          'cursor-default',
          'select-none',
        ],
      }),
      input: ({ props }) => ({
        class: [
          //Font
          'font-sans',
          'leading-6',
          'sm:text-xs',

          // Display
          'block',
          'flex-auto',

          // Color and Background
          'bg-transparent',
          'border-0',
          {
            'text-surface-800 dark:text-white/80': props.modelValue,
            'text-surface-400 dark:text-surface-500': !props.modelValue,
          },
          'placeholder:text-surface-400 dark:placeholder:text-surface-500',

          'py-1.5 px-[9.6px]',

          //Shape
          'rounded-none',

          // Transitions
          'transition',
          'duration-200',

          // States
          'focus:outline-none focus:shadow-none',

          // Misc
          'relative',
          'cursor-pointer',
          'overflow-hidden overflow-ellipsis',
          'whitespace-nowrap',
          'appearance-none',
        ],
      }),
    },
    filterrowitems: {
      class: 'py-1 list-none m-0',
    },
    filterrowitem: ({ context }) => ({
      class: [
        // Font
        'sm:text-xs',
        'leading-none',
        {
          'font-normal': !context?.highlighted,
          'font-bold': context?.highlighted,
        },

        // Position
        'relative',

        // Shape
        'border-0',
        'rounded-none',

        // Spacing
        'm-0',
        'py-2 px-4',

        // Color
        { 'text-surface-700 dark:text-white/80': !context?.highlighted },
        {
          'bg-surface-0 dark:bg-surface-800 text-surface-700 dark:text-white/80':
            !context?.highlighted,
        },
        {
          'bg-primary-500 dark:bg-primary-400 text-white dark:text-surface-700':
            context?.highlighted,
        },

        //States
        'hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white dark:hover:text-surface-700',
        'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

        // Transitions
        'transition-shadow',
        'duration-200',

        // Misc
        'cursor-pointer',
        'overflow-hidden',
        'whitespace-nowrap',
      ],
    }),
    filteroperator: {
      class: [
        // Spacing
        'p-4',

        // Shape
        'border-b border-solid',
        'rounded-t-md',

        // Color
        'text-surface-700 dark:text-white/80',
        'border-surface-200 dark:border-surface-700',
      ],
    },
    filteroperatordropdown: {
      root: ({ state }) => ({
        class: [
          // Display and Position
          'flex',
          'relative',

          // Shape
          'w-full',
          'rounded-md',
          'shadow-sm',

          // Color and Background
          'text-surface-800 dark:text-white/80',
          'placeholder:text-surface-400 dark:placeholder:text-surface-500',
          'bg-surface-0 dark:bg-surface-900',
          {
            'ring-1 ring-inset ring-surface-300 dark:ring-surface-700':
              !state.focused,
          },

          // Transitions
          'transition-all',
          'duration-200',

          // States
          {
            'outline-none outline-offset-0 ring-2 ring-primary-500 dark:ring-primary-400':
              state.focused,
          },

          // Misc
          'cursor-default',
          'select-none',
        ],
      }),
      input: {
        class: [
          //Font
          'font-sans',
          'leading-6',
          'sm:text-xs',

          // Display
          'block',
          'flex-auto',

          // Color and Background
          'bg-transparent',
          'border-0',
          'text-surface-800 dark:text-white/80',
          'placeholder:text-surface-400 dark:placeholder:text-surface-500',

          'py-1.5 px-[9.6px]',

          //Shape
          'rounded-none',

          // Transitions
          'transition',
          'duration-200',

          // States
          'focus:outline-none focus:shadow-none',

          // Misc
          'relative',
          'cursor-pointer',
          'overflow-hidden overflow-ellipsis',
          'whitespace-nowrap',
          'appearance-none',
        ],
      },
      trigger: {
        class: [
          // Flexbox
          'flex items-center justify-center',
          'shrink-0',

          // Color and Background
          'bg-transparent',
          'text-surface-500',

          // Size
          'w-12',

          // Shape
          'rounded-tr-md',
          'rounded-br-md',
        ],
      },
      panel: {
        class: [
          // Position
          'absolute top-0 left-0',
          'mt-2',

          // Shape
          'border-0',
          'rounded-md',
          'shadow-md',

          // Size
          'min-w-[12.5rem]',

          // Color
          'bg-surface-0 dark:bg-surface-800',
          'text-surface-800 dark:text-white/80',
          'ring-1 ring-inset ring-surface-300 dark:ring-surface-700',
        ],
      },
      list: {
        class: 'py-1 list-none m-0',
      },
      item: ({ context }) => ({
        class: [
          // Font
          'sm:text-xs',
          'leading-none',
          {
            'font-normal': !context?.highlighted,
            'font-bold': context?.highlighted,
          },

          // Position
          'relative',

          // Shape
          'border-0',
          'rounded-none',

          // Spacing
          'm-0',
          'py-2 px-4',

          // Color
          { 'text-surface-700 dark:text-white/80': !context?.highlighted },
          {
            'bg-surface-0 dark:bg-surface-800 text-surface-700 dark:text-white/80':
              !context?.highlighted,
          },
          {
            'bg-primary-500 dark:bg-primary-400 text-white dark:text-surface-700':
              context?.highlighted,
          },

          //States
          'hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white dark:hover:text-surface-700',

          // Transitions
          'transition-shadow',
          'duration-200',

          // Misc
          'cursor-pointer',
          'overflow-hidden',
          'whitespace-nowrap',
        ],
      }),
    },
    filterconstraint: {
      class: [
        // Spacing
        'p-4',

        // Shape
        'border-b border-solid',

        // Color
        'border-surface-200 dark:border-surface-700',
      ],
    },
    filteraddrule: {
      class: 'pt-4 pb-2 px-4',
    },
    filteraddrulebutton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-xs px-[9.6px] py-1.5 min-w-[2rem] w-full',

          // Shape
          'rounded-md',

          'bg-transparent border-transparent',
          'text-primary-500 dark:text-primary-400',
          'hover:bg-primary-400/20',
          'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current',
          'focus:ring-primary-500 dark:focus:ring-primary-400',

          // Transitions
          'transition duration-200 ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
      label: {
        class: 'flex-auto grow-0',
      },
      icon: {
        class: 'mr-2',
      },
    },
    filterremovebutton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-xs px-[9.6px] py-1.5 min-w-[2rem] w-full mt-2',

          // Shape
          'rounded-md',

          'bg-transparent border-transparent',
          'text-red-500 dark:text-red-400',
          'hover:bg-red-300/20',
          'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-offset-current',
          'focus:ring-red-500 dark:focus:ring-red-400',

          // Transitions
          'transition duration-200 ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
      label: {
        class: 'flex-auto grow-0',
      },
      icon: {
        class: 'mr-2',
      },
    },
    filterbuttonbar: {
      class: [
        // Flex & Alignment
        'flex items-center justify-between',

        // Space
        'py-4 px-4',
      ],
    },
    filterclearbutton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-xs px-[9.6px] py-1.5 min-w-[2rem]',

          // Shape
          'rounded-md shadow-sm border-0',

          'text-primary-500 ring-1 ring-primary-500 hover:bg-primary-400/20',
          'hover:bg-primary-400/20',
          'focus:ring-primary-500 dark:focus:ring-primary-400',

          // Transitions
          'transition duration-200 ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
    },
    filterapplybutton: {
      root: {
        class: [
          'relative',

          // Alignments
          'items-center inline-flex text-center align-bottom justify-center',

          // Sizes & Spacing
          'text-xs px-[9.6px] py-1.5 min-w-[2rem]',

          // Shape
          'rounded-md border-0',

          'text-white dark:text-surface-900',
          'bg-primary-500 dark:bg-primary-400',
          'ring-1 ring-primary-500 dark:ring-primary-400',
          'hover:bg-primary-600 dark:hover:bg-primary-400 hover:ring-primary-600 dark:hover:ring-primary-300',
          'focus:ring-primary-500 dark:focus:ring-primary-400',

          // Transitions
          'transition duration-200 ease-in-out',

          // Misc
          'cursor-pointer overflow-hidden select-none',
        ],
      },
    },
    filtermenubutton: ({ context }) => ({
      class: [
        'relative',
        // Flex & Alignment
        'inline-flex items-center justify-center',

        // Size
        'w-8 h-8',

        // Spacing
        'ml-2',

        // Shape
        'rounded-full',

        // Color
        { 'bg-primary-50 text-primary-700': context.active },
        'dark:text-white/70 dark:hover:text-white/80 dark:bg-surface-800',

        // States
        'hover:text-surface-700 hover:bg-surface-300/20',
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400',

        // Transition
        'transition duration-200',

        // Misc
        'cursor-pointer no-underline overflow-hidden',
      ],
    }),
    headerfilterclearbutton: ({ context }) => ({
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Shape
        'border-none',

        // Spacing
        'm-0 p-0 ml-2',

        // Color
        'bg-transparent',

        // Misc
        'cursor-pointer no-underline overflow-hidden select-none',
        {
          invisible: !context.hidden,
        },
      ],
    }),
    rowtoggler: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Spacing
        'm-0 p-0',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-white',
        'bg-transparent',
        'focus-visible:outline-none focus-visible:outline-offset-0',
        'focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

        // Transition
        'transition duration-200',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    columnresizer: {
      class: [
        'block',

        // Position
        'absolute top-0 right-0',

        // Sizing
        'w-2 h-full',

        // Spacing
        'm-0 p-0',

        // Color
        'border border-transparent',

        // Misc
        'cursor-col-resize',
      ],
    },
    rowreordericon: {
      class: 'cursor-move',
    },
    roweditorinitbutton: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-700 dark:text-white/70',
        'border-transparent',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400',
        'hover:text-surface-700 hover:bg-surface-300/20',

        // Transition
        'transition duration-200',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    roweditorsavebutton: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-700 dark:text-white/70',
        'border-transparent',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400',
        'hover:text-surface-700 hover:bg-surface-300/20',

        // Transition
        'transition duration-200',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    roweditorcancelbutton: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex items-center justify-center',
        'text-left',

        // Size
        'w-8 h-8',

        // Shape
        'border-0 rounded-full',

        // Color
        'text-surface-700 dark:text-white/70',
        'border-transparent',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400',
        'hover:text-surface-700 hover:bg-surface-300/20',

        // Transition
        'transition duration-200',

        // Misc
        'overflow-hidden',
        'cursor-pointer select-none',
      ],
    },
    radiobuttonwrapper: {
      class: [
        'relative',

        // Flex & Alignment
        'inline-flex align-bottom',

        // Size
        'w-4 h-4',

        // Misc
        'cursor-pointer select-none',
      ],
    },
    rowRadioButton: {
      root: {
        class: [
          'relative',

          // Flexbox & Alignment
          'inline-flex',
          'align-bottom',

          // Size
          'w-4 h-4',

          // Misc
          'cursor-default',
          'select-none',
        ],
      },
      box: ({ props }) => ({
        class: [
          // Flexbox
          'flex justify-center items-center',

          // Size
          'w-4 h-4',
          'text-xs',
          'font-medium',

          // Shape
          'border-2',
          'rounded-full',

          // Transition
          'transition duration-200 ease-in-out',

          // Colors
          {
            'text-surface-700 dark:text-white/80': !props.modelValue,
            'bg-surface-0 dark:bg-surface-900': !props.modelValue,
            'border-surface-300 dark:border-surface-700': !props.modelValue,
            'border-primary-500 dark:border-primary-400': props.modelValue,
          },

          // States
          {
            'outline-none outline-offset-0': !props.disabled,
            'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-0 dark:focus-visible:ring-offset-surface-800 peer-focus-visible:ring-primary-500 dark:peer-focus-visible:ring-primary-400':
              !props.disabled,
            'opacity-60 cursor-default': props.disabled,
          },
        ],
      }),
      input: {
        class: [
          'peer',

          // Size
          'w-full ',
          'h-full',

          // Position
          'absolute',
          'top-0 left-0',
          'z-10',

          // Spacing
          'p-0',
          'm-0',

          // Shape
          'opacity-0',
          'rounded-md',
          'outline-none',
          'border-2 border-surface-300 dark:border-surface-700',

          // Misc
          'appareance-none',
          'cursor-default',
        ],
      },
      icon: {
        class: 'hidden',
      },
    },
    headerCheckbox: {
      ...presetCheckbox,
      root: {
        class: [
          '!mx-auto',
          ...presetCheckbox.root.class,
          '[&:has([aria-checked=false])_[data-pc-section=box]]:!bg-primary-400 [&:has([aria-checked=false])_[data-pc-section=box]]:!border-white',
        ],
      },
    },
    rowCheckbox: {
      ...presetCheckbox,
      root: { class: ['!mx-auto', ...presetCheckbox.root.class] },
    },
    transition: {
      enterFromClass: 'opacity-0 scale-y-[0.8]',
      enterActiveClass:
        'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
      leaveActiveClass: 'transition-opacity duration-100 ease-linear',
      leaveToClass: 'opacity-0',
    },
  },
  bodyrow: ({ context, props }) => ({
    class: [
      // 'rounded-lg',

      // Color
      {
        'text-white dark:text-general-50': !context.selected,
        'text-primary-500 dark:text-general-50': context.selected,
      },
      {
        'bg-primary-50': context.selected && context.stripedRows,
      },
      {
        'bg-primary-50': context.selected && !context.stripedRows,
      },
      {
        'bg-transparent text-surface-600 dark:bg-transparent':
          !context.selected,
      },
      // { 'bg-white dark:bg-white': props.frozenRow },
      {
        'odd:bg-surface-0 odd:text-surface-600 dark:odd:bg-surface-800 even:bg-surface-50 even:text-surface-600 dark:even:bg-surface-900/60':
          context.stripedRows && !context.selected,
      },

      // State
      {
        'focus:outline-none focus:outline-offset-0': props.selectionMode,
      },
      // {
      //   'hover:bg-surface-50 hover:text-surface-600':
      //     props.selectionMode && !context.selected,
      // },

      // Transition
      {
        'transition duration-200':
          (props.selectionMode && !context.selected) || props.rowHover,
      },

      // Misc
      { 'cursor-pointer': props.selectionMode },
    ],
  }),
  rowexpansion: ({ instance }) => ({
    class: [{ 'bg-primary-50': instance?.isSelected }],
  }),
  rowexpansioncell: {
    class: [
      // Spacing
      'px-[64px] pt-3',

      // Shape
      'border-b border-solid border-primary-100',

      '[&_table]:!border-b-0',
    ],
  },
  rowgroupheader: {
    class: [
      '!sticky z-20',
      'bg-surface-0 text-surface-600 dark:text-white/70',
      'dark:bg-surface-800',
    ],
  },
  rowgroupfooter: {
    class: [
      'sticky z-20',
      'bg-surface-0 text-surface-600 dark:text-white/70',
      'dark:bg-surface-800',
    ],
  },
  rowgrouptoggler: {
    class: [
      'relative',

      // Flex & Alignment
      'inline-flex items-center justify-center',
      'text-left',

      // Spacing
      'm-0 p-0',

      // Size
      'w-8 h-8',

      // Shape
      'border-0 rounded-full',

      // Color
      'text-surface-500 dark:text-white/70',
      'bg-transparent',
      'focus-visible:outline-none focus-visible:outline-offset-0',
      'focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

      // Transition
      'transition duration-200',

      // Misc
      'overflow-hidden',
      'cursor-pointer select-none',
    ],
  },
  rowgrouptogglericon: {
    class: 'inline-block w-4 h-4',
  },
  resizehelper: {
    class:
      'resizer absolute cursor-col-resize translate-x-[-1px] hidden w-[10px] z-40 border-l border-primary-500',
  },
};
