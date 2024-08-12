const timepickerlabel = {
  class:
    '[&_span]:w-[37px] [&_span]:h-[26px] [&_span]:flex [&_span]:justify-center [&_span]:items-center [&_span]:border [&_span]:border-general-200 [&_span]:rounded [&_span]:dark:text-general-800',
};

export default {
  root: ({ props }) => ({
    class: [
      // Display and Position
      'inline-flex flex-auto justify-between items-center gap-[5px]',
      'rounded',

      // Spacing
      'm-0 px-3 py-1',

      // Border already handled by input group.
      // 'border-general-200 dark:border-general-200 border-offset-0',

      // Misc
      {
        'opacity-40 select-none pointer-events-none cursor-default':
          props.disabled,
      },
    ],
  }),
  input: ({ props }) => ({
    class: [
      'w-full',

      // Font
      'text-xs tracking-[2%] font-normal placeholder:font-light',

      // Colors
      'text-general-800 dark:text-general-800',
      'placeholder:text-general-200 dark:placeholder:text-general-200',
      'bg-white',

      // Shape
      'appearance-none',
      // { 'rounded-md': !props.showIcon || props.iconDisplay == 'input' },
      // {
      //   'rounded-l-md  flex-1 pr-9 ':
      //     props.showIcon && props.iconDisplay !== 'input',
      // },
      // {
      //   'rounded-md flex-1 pr-9':
      //     props.showIcon && props.iconDisplay === 'input',
      // },

      // Transitions
      'transition-colors',
      'duration-200',

      // States
      'outline-none focus:ring-primary-400 dark:focus:ring-primary-400',
    ],
  }),
  inputicon: {
    class: ['text-general-500 dark:text-general-800'],
  },
  dropdownbutton: {
    root: {
      class: [
        'relative text-sm',

        // Alignments
        'items-center inline-flex text-center align-bottom',

        // Shape
        'rounded-r-md',

        // Size
        'px-2.5 py-1.5 leading-none',

        // Colors
        'text-surface-600 dark:text-surface-100',
        'bg-surface-100 dark:bg-surface-800',
        'ring-1 ring-inset ring-surface-300 dark:ring-surface-700',

        // States
        'hover:bg-surface-200 dark:hover:bg-surface-700',
        'focus:outline-none focus:outline-offset-0 focus:ring-1',
        'focus:ring-primary-400 dark:focus:ring-primary-400',
      ],
    },
  },
  panel: ({ props }) => ({
    class: [
      'datepicker-panel',
      // Display & Position
      'inline-flex',
      'flex-col justify-start items-center gap-2.5',
      {
        'absolute': !props.inline,
        'inline-block': props.inline,
      },

      // Size
      '!w-[272px] !min-w-[272px] h-max p-6 shadow-panel',
      { 'min-w-[80vw] w-auto p-2 ': props.touchUI },
      { 'p-2 min-w-full': props.inline },

      // Shape
      'rounded-[7px]',

      // Colors
      'bg-white',

      //Misc
      { 'overflow-x-auto': props.inline },
    ],
  }),
  datepickerMask: {
    class: [
      'fixed top-0 left-0 w-full h-full',
      'flex items-center justify-center',
      'bg-black bg-opacity-90',
    ],
  },
  header: ({ props, state }) => ({
    class: [
      'min-h-[26.8px]',

      {
        hidden:
          !props.dateFormat?.toString().toLowerCase().includes('y') &&
          state.currentView === 'month',
      },

      //Font
      'text-xs font-normal',

      // Flexbox and Alignment
      'flex justify-between items-start gap-1',

      // Spacing
      'm-0 mb-2',
      // {
      //   'py-2 pl-2 pb-4': props.numberOfMonths <= 1,
      //   'py-2 pb-4': props.numberOfMonths > 1,
      // },

      // Shape
      'rounded-t-md',

      // Colors
      'text-general-800 dark:general-800',
      'bg-white',
    ],
  }),
  previousbutton: ({ props }) => ({
    class: [
      'relative',

      // Flexbox and Alignment
      'inline-flex items-center justify-center',
      'order-1',
      // {
      //   ' order-2': !(props.numberOfMonths > 1),
      //   'order-1': props.numberOfMonths > 1,
      // },

      // Size
      'p-1.5 m-0',

      // Colors
      'text-general-800 dark:text-general-950',
      'border-0 ',
      'bg-transparent',

      // States
      'hover:bg-general-50 dark:hover:bg-general-300',

      // Misc
      'cursor-pointer overflow-hidden',
    ],
  }),
  title: ({ props }) => ({
    class: [
      // Text
      'dark:text-general-800 leading-6',
      'my-0',
      'order-2',
      // {
      //   'mr-auto': !(props.numberOfMonths > 1),
      //   ' mx-auto': props.numberOfMonths > 1,
      // },
    ],
  }),
  monthTitle: {
    class: [
      //Font
      'text-xs font-normal',

      // Colors
      'text-general-800 dark:text-general-800',
      'bg-white',

      // Transitions
      'transition duration-200',

      // Spacing
      'mr-1',

      // States
      'hover:text-primary-400 dark:hover:text-primary-400',

      // Misc
      'cursor-pointer',
    ],
  },
  yearTitle: ({ props }) => ({
    class: [
      {
        hidden: !props.dateFormat?.toString().toLowerCase().includes('y'),
      },

      //Font
      'text-xs font-normal',

      // Colors
      'text-general-800 dark:text-general-800',
      'bg-white',

      // Transitions
      'transition duration-200',

      // Spacing
      'm-0 mr-1',

      // States
      'hover:text-primary-600 dark:hover:text-primary-300',

      // Misc
      'cursor-pointer',
    ],
  }),
  nextbutton: ({ props }) => ({
    class: [
      'relative',

      // Flexbox and Alignment
      'inline-flex items-center justify-center order-3',
      // {
      //   ' order-3': !(props.numberOfMonths > 1),
      //   'order-1': props.numberOfMonths > 1,
      // },

      // Size
      'p-1.5 m-0',

      // Colors
      'text-general-800 dark:text-general-950',
      'border-0 ',
      'bg-transparent',

      // States
      'hover:bg-general-50 dark:hover:bg-general-300',

      // Misc
      'cursor-pointer overflow-hidden',
    ],
  }),
  table: {
    class: [
      // Size & Shape
      'block w-[224px]',
      '[&_tbody]:block [&_tbody]:w-[224px]',

      // Spacing
      'm-0',

      '[&_th]:text-xs [&_td]:text-xs',
      '[&_th]:font-normal [&_td]:font-normal',
      '[&_th]:text-general-800 [&_td]:text-general-800',
      'dark:[&_th]:text-general-800 dark:[&_td]:text-general-800',

      // Hide the other months day
      '[&_[data-p-other-month="true"]]:invisible',
    ],
  },
  tableheadercell: {
    class: [
      // Spacing
      'px-2 py-[5.4px]',
    ],
  },
  tablebodyrow: {
    class: [
      // 'border-b border-surface-200 dark:border-surface-700 last:border-b-0',
    ],
  },
  weekheader: {
    class: [
      'leading-6 text-sm font-normal',
      'text-surface-600 dark:text-white/70',
      'opacity-40 cursor-default',
      'mb-2',
    ],
  },
  weeknumber: {
    class: [
      'text-surface-600 dark:text-white/70 font-normal',
      'opacity-40 cursor-default',
    ],
  },
  weekday: {
    class: [
      // Colors
      // 'text-surface-500 dark:text-white/60 font-normal',
    ],
  },
  day: {
    class: [
      // Spacing
      'p-0',
    ],
  },
  weeklabelcontainer: ({ context }) => ({
    class: [
      // Flexbox and Alignment
      'flex items-center justify-center',
      'mx-auto',

      // Shape & Size
      'w-10 h-10',
      '',
      'border-transparent border',

      // Colors
      {
        'text-surface-600 dark:text-white/70 bg-transparent':
          !context.selected && !context.disabled,
        'text-primary-400  dark:text-primary-400':
          context.selected && !context.disabled,
      },

      // States
      'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50',
      {
        'hover:bg-surface-100 dark:hover:bg-surface-800/80': !context.disabled,
      },
      {
        'opacity-40 cursor-default': context.disabled,
        'cursor-pointer': !context.disabled,
      },
    ],
  }),
  daylabel: ({ context }) => ({
    class: [
      // Flexbox and Alignment
      'flex items-center justify-center',
      // 'mx-auto',

      // Shape & Size
      'w-8 h-8',

      // Colors
      {
        'bg-primary-400 dark:bg-primary-400 text-white rounded-none':
          (context.selected && !context.disabled) || context.date.today,
      },

      // States
      'focus:outline-none focus-visible:outline-none',
      {
        'hover:bg-primary-400/90': context.selected || context.date.today,
        'hover:bg-primary-200': !context.selected,
      },

      {
        'opacity-40 cursor-default': context.disabled,
        'cursor-pointer': !context.disabled,
      },
    ],
  }),
  monthpicker: {
    class: [
      // Layout
      'w-full grid grid-cols-3 grid-rows-4 gap-y-4 gap-x-0',
    ],
  },
  month: ({ context }) => ({
    'class': [
      // Flexbox and Alignment
      'inline-flex items-center justify-center',

      // Size
      'w-full',
      'px-2.5 py-1.5',
      'text-xs leading-tight',

      // Shape
      '!rounded-[20px]',

      // Colors
      {
        'text-general-800 dark:text-general-800 bg-transparent':
          !context.selected && !context.disabled,
        'bg-primary-400 text-white dark:bg-primary-400 dark:text-white':
          context.selected && !context.disabled,
      },

      // States
      // 'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-400 dark:focus:ring-primary-400',
      'hover:bg-primary-50 dark:hover:bg-general-300',
      'hover:text-general-800 dark:hover:text-general-800',

      // Misc
      'cursor-pointer',
    ],
    'data-month-in-future':
      parseInt(context?.monthIndex) > new Date().getMonth(),
  }),
  yearpicker: {
    class: [
      // Layout
      'w-full grid grid-cols-2 grid-rows-5 gap-y-1 gap-x-0',
    ],
  },
  year: ({ context }) => ({
    'class': [
      // Flexbox and Alignment
      'inline-flex items-center justify-center',

      // Size
      'w-full',
      'px-2.5 py-1.5',
      'text-xs leading-tight',

      // Shape
      '!rounded-[20px]',

      // Colors
      {
        'text-general-800 dark:text-general-800 bg-transparent':
          !context.selected && !context.disabled,
        'bg-primary-400 text-white dark:bg-primary-400 dark:text-white':
          context.selected && !context.disabled,
      },

      // States
      // 'focus:outline-none focus:outline-offset-0 focus:ring-1 focus:ring-primary-400 dark:focus:ring-primary-400',
      'hover:text-general-800 dark:hover:text-general-800',
      'hover:bg-primary-50 dark:hover:bg-general-300',

      // Misc
      'cursor-pointer',
    ],
    'data-year-in-future':
      parseInt(context?.year.value) > new Date().getFullYear(),
  }),
  timepicker: {
    class: [
      // Flexbox
      'flex',
      'justify-center items-center',
      'gap-2',

      // Spacing
      'p-1.5',
    ],
  },
  separatorcontainer: {
    class: [
      // Flexbox and Alignment
      'flex',
      'items-center',
      'flex-col',

      // Spacing
      // 'px-2',
    ],
  },
  separator: {
    class: [
      // Text
      'text-xs font-normal',
    ],
  },
  hourpicker: {
    class: [
      // Flexbox and Alignment
      'flex',
      'items-center',
      'flex-col',
      'gap-3',

      // Spacing
      // 'px-2',

      // Sizing
      'text-xs',

      // Misc
      timepickerlabel.class,
    ],
  },
  minutepicker: {
    class: [
      // Flexbox and Alignment
      'flex',
      'items-center',
      'flex-col',
      'gap-3',

      // Spacing
      // 'px-2',

      // Sizing
      'text-xs',

      // Misc
      timepickerlabel.class,
    ],
  },
  secondPicker: {
    class: [
      // Flexbox and Alignment
      'flex',
      'items-center',
      'flex-col',
      'gap-3',

      // Spacing
      // 'px-2',

      // Sizing
      'text-xs',
    ],
  },
  incrementbutton: {
    class: [
      'relative',

      // Flexbox and Alignment
      'inline-flex items-center justify-center',

      // Size
      'p-0.5 m-0',
      '!h-6 !w-6',

      '[&_i]:w-5',
      '[&_i]:h-5',
      '[&_i]:shrink-0',
      '[&_i]:dark:text-general-950',

      // Colors
      'text-general-800',
      'border-0',
      'bg-transparent',

      // States
      // 'hover:text-surface-700 dark:hover:text-white/80',

      // Misc
      'cursor-pointer overflow-hidden',
    ],
  },
  decrementbutton: {
    class: [
      'relative',

      // Flexbox and Alignment
      'inline-flex items-center justify-center',

      // Size
      'p-0.5 m-0',
      '!h-6 !w-6',

      '[&_i]:w-5',
      '[&_i]:h-5',
      '[&_i]:shrink-0',
      '[&_i]:dark:text-general-950',

      // Colors
      'text-general-800',
      'border-0',
      'bg-transparent',

      // States
      // 'hover:text-surface-700 dark:hover:text-white/80',

      // Misc
      'cursor-pointer overflow-hidden',
    ],
  },
  groupcontainer: {
    class: [
      // Flexbox
      'flex w-full',
    ],
  },
  group: {
    class: [
      // // Flexbox and Sizing
      // 'flex-1',
      'w-full',

      // // Borders
      // 'border-l',
      // 'border-surface-200 dark:border-surface-700',

      // // Spacing
      // 'pr-0.5',
      // 'pl-0.5',
      // 'pt-0',
      // 'pb-0',

      // // Pseudo-Classes
      // 'first:pl-0',
      // 'first:border-l-0',
    ],
  },
  buttonbar: {
    class: [
      // Flexbox
      'flex justify-between items-center',

      // Spacing
      'pt-2.5 pb-1.5 px-0',

      // Shape
      'border-t border-surface-200 dark:border-surface-700',
    ],
  },
  todaybutton: {
    root: {
      class: [
        // Flexbox and Alignment
        'inline-flex items-center justify-center',

        // Spacing
        'px-2.5 py-1.5 text-sm leading-none',

        // Shape
        '',

        // Colors
        'bg-transparent border-transparent',
        'text-primary-400 dark:text-primary-400',

        // Transitions
        'transition-colors duration-200 ease-in-out',

        // States
        // 'focus:outline-none focus:outline-offset-0 focus:ring-2 ring-inset',
        // 'focus:ring-primary-400 dark:focus:ring-primary-400',

        // Misc
        'cursor-pointer',
      ],
    },
  },
  clearbutton: {
    root: {
      class: [
        // Flexbox and Alignment
        'inline-flex items-center justify-center',

        // Spacing
        'px-2.5 py-1.5 text-sm leading-none',

        // Shape

        // Colors
        'bg-transparent border-transparent',
        'text-primary-400 dark:text-primary-400',

        // Transitions
        'transition-colors duration-200 ease-in-out',

        // States
        'focus:outline-none focus:outline-offset-0 focus:ring-2 ring-inset',
        'focus:ring-primary-400 dark:focus:ring-primary-400',
        'hover:bg-primary-300/20',

        // Misc
        'cursor-pointer',
      ],
    },
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
};
