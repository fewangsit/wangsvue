import MultiSelectPreset from '../multiselect';

export default {
  root: ({ props, state }) => ({
    class: [
      // Display and Position
      'inline-flex items-center',
      'relative',

      // Shape
      'w-full',
      // 'w-full md:w-56',
      'rounded-md',
      // 'shadow-sm',

      // Color and Background
      // 'bg-surface-0 dark:bg-surface-900',

      // States
      // {
      //   'ring-1 ring-inset ring-placeholder dark:ring-placeholder':
      //     !state.focused,
      //   'ring-2 ring-inset ring-primary-weak dark:ring-primary-weak':
      //     state.focused,
      // },

      // Misc
      'cursor-default',
      'select-none',
      { 'opacity-60': props.disabled, 'pointer-events-none': props.disabled },
    ],
  }),
  input: ({ props }) => ({
    class: [
      //Font
      'text-xs',
      {
        '!text-general-200 dark:text-grayscale-800 font-light':
          props.modelValue == null,
        'text-general-800 dark:text-general-100 font-normal':
          props.modelValue != null,
      },

      // Display
      'block',
      'flex-auto',

      // Color and Background
      'bg-transparent',
      'border-0',
      'placeholder:text-general-200 dark:placeholder:text-general-200',

      // Sizing and Spacing
      'h-max',
      'py-[5px] px-3 pr-0',
      { 'pr-7': props.showClear },

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
  trigger: {
    class: [
      //Font
      // 'sm:text-sm',

      // Spacing
      'mr-1',

      // Flexbox
      'flex items-center justify-center',
      'shrink-0',

      // Color and Background
      'bg-transparent',
      'text-general-200',

      // Size
      'w-6 h-full',

      // Shape
      'rounded-tr-md',
      'rounded-br-md',
    ],
  },
  panel: {
    class: [
      // Position
      'absolute top-0 left-0 !z-[9999]',
      'mt-2',

      'max-w-[30vw]',

      // Shape
      'border-0',
      'rounded-lg',
      'shadow-panel',

      // Color
      'bg-surface-0 dark:bg-grayscale-900',
      'text-surface-800 dark:text-general-100',
      // 'ring-1 ring-inset ring-surface-300 dark:ring-surface-700',
    ],
  },
  wrapper: {
    class: [
      // Sizing
      'max-h-[15rem]',

      // Color
      'bg-white',

      // Misc
      'overflow-auto',
      'rounded-br-lg',
      'rounded-bl-lg',
    ],
  },
  list: {
    class: 'list-none m-0',
  },
  item: ({ context }) => ({
    class: [
      // Font
      'text-xs font-normal',
      // { 'font-medium': !context.selected, 'font-bold': context.selected },
      'w-full overflow-hidden text-ellipsis',

      // Position
      'relative',

      // Shape
      'border-0',
      'rounded-none',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      { 'bg-primary-50': context.selected },
      {
        'text-surface-700 dark:text-general-100':
          !context.focused && !context.selected && !context.disabled,
      },
      {
        'text-surface-600 dark:text-general-300':
          !context.focused && !context.selected && context.disabled,
      },
      {
        'bg-surface-200 dark:bg-general-800 text-surface-700 dark:text-general-100':
          context.focused && !context.selected,
      },
      {
        'bg-primary-bg-weak dark:bg-general-800 text-primary dark:text-general-100':
          context.focused && context.selected,
      },
      {
        'text-surface-700 dark:text-general-100':
          !context.focused && context.selected,
      },

      //States
      'hover:bg-primary-bg-weak dark:hover:bg-general-700 hover:text-primary dark:hover:text-general-100',
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',

      // Misc
      { 'pointer-events-none cursor-default': context.disabled },
      { 'cursor-pointer': !context.disabled },
      'overflow-hidden',
      'whitespace-nowrap',
    ],
  }),
  itemgroup: {
    class: [
      //Font
      'font-bold',
      'sm:text-sm',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      'text-surface-800 dark:text-surface-800',
      'bg-surface-0 dark:bg-surface-0',

      // Misc
      'cursor-auto',
    ],
  },
  emptymessage: {
    class: [
      // Font
      'leading-none text-xs',

      // Spacing
      'py-2 px-4',

      // Color
      'text-surface-800 dark:text-general-100',
      'bg-transparent',
    ],
  },
  header: MultiSelectPreset.header,
  filtercontainer: MultiSelectPreset.filtercontainer,
  filterinput: MultiSelectPreset.filterinput,
  filtericon: MultiSelectPreset.filtericon,
  clearicon: {
    class: [
      // Color
      'text-general-200',

      // Position
      'absolute',
      'top-1/2',
      'right-12',

      // Spacing
      '-mt-2',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
};
