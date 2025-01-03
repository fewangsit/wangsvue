import MultiSelectPreset from '../multiselect/index.js';

export default {
  root: ({ props, state }) => ({
    class: [
      // Display and Position
      'inline-flex items-center',
      'relative',

      // Shape
      'w-full',
      'rounded-md',

      // Misc
      'cursor-default',
      'select-none',
      { 'opacity-60': props.disabled, 'pointer-events-none': props.disabled },
    ],
  }),
  input: ({ props }) => ({
    class: [
      //Font
      'text-xs  font-normal',
      {
        '!text-general-200': props.modelValue == null,
        'text-grayscale-900': props.modelValue != null,
      },

      // Display
      'block',
      'flex-auto',

      // Color and Background
      'bg-transparent',
      'border-0',
      'placeholder:text-general-200',

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
      'bg-surface-0',
      'text-surface-800',
    ],
  },
  wrapper: ({ props }) => ({
    class: [
      // Sizing
      'max-h-[15rem]',

      // Shape
      'border-[0.5px]',

      // Color
      'bg-white',
      'border-grayscale-900',

      // Misc
      'overflow-auto',
      {
        'rounded-lg': !props.filter,
        'rounded-br-lg rounded-bl-lg': props.filter,
      },
    ],
  }),
  list: {
    class: 'list-none m-0',
  },
  item: ({ context }) => ({
    class: [
      // Font
      'text-xs font-normal',
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
      { '!font-medium': context.selected },
      {
        'text-surface-700':
          !context.focused && !context.selected && !context.disabled,
      },
      {
        'text-surface-600':
          !context.focused && !context.selected && context.disabled,
      },
      {
        'bg-primary-50 text-surface-700': context.focused && !context.selected,
      },
      {
        'bg-primary-50 text-primary-500': context.focused && context.selected,
      },
      {
        'text-surface-700': !context.focused && context.selected,
      },

      //States
      'hover:bg-primary-bg-weak hover:text-primary',
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary-500',

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
      'text-surface-800',
      'bg-surface-0',

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
      'text-surface-800',
      'bg-transparent',
    ],
  },
  header: MultiSelectPreset?.header,
  filtercontainer: MultiSelectPreset?.filtercontainer,
  filterinput: MultiSelectPreset?.filterinput,
  filtericon: MultiSelectPreset?.filtericon,
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
