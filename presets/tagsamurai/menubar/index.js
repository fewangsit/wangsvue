export default {
  root: {
    class: [
      'relative',

      // Flexbox
      'flex',
      'items-center',
      'gap-6',

      // Spacing
      'px-6',
      'min-h-[4rem]',

      // Shape
      'rounded-md',
      'shadow-md',

      // Color
      'bg-surface-0',
      'ring-1 ring-inset ring-surface-100 ring-offset-0',
    ],
  },
  menu: ({ props }) => ({
    class: [
      // Flexbox
      'sm:flex sm:row-gap-2 sm:col-gap-4',
      'items-center',
      'flex-wrap',
      'flex-col sm:flex-row',
      { hidden: !props?.mobileActive, flex: props?.mobileActive },

      // Position
      'absolute sm:relative',
      'top-full left-0',
      'sm:top-auto sm:left-auto',

      // Size
      'w-full sm:w-auto',

      // Spacing
      'm-0 ',
      'py-2 px-1.5 sm:py-0 sm:p-0 sm:py-1.5',
      'list-none',

      // Shape
      'shadow-md sm:shadow-none',
      'border-0',
      'sm:rounded-none rounded-md',

      // Color
      'bg-surface-0 sm:bg-transparent',

      // Misc
      'outline-none',
    ],
  }),
  menuitem: {
    class: 'sm:relative sm:w-auto w-full static',
  },
  content: ({ props, context }) => ({
    class: [
      // Shape
      { 'rounded-md': props.root },

      //  Colors
      {
        'text-surface-500/70':
          !context.focused && !context.active,
        'text-surface-500/70 bg-surface-200':
          context.focused && !context.active,
        'text-surface-900/80 bg-surface-50':
          !context.focused && context.active,
      },

      // Hover States
      {
        'hover:bg-surface-50': !context.active,
        'hover:bg-surface-100 text-surface-900/80':
          context.active,
      },

      // Transitions
      'transition-all',
      'duration-200',
    ],
  }),
  action: ({ context }) => ({
    class: [
      'relative',

      // Font
      'sm:text-sm font-medium',

      // Flexbox
      'flex',
      'items-center',

      // Spacing
      'py-2',
      'px-3',
      'my-1 sm:my-0',

      // Size
      {
        'pl-5 sm:pl-3': context.level === 1,
        'pl-7 sm:pl-3': context.level === 2,
      },

      // Misc
      'select-none',
      'cursor-pointer',
      'no-underline ',
      'overflow-hidden',
    ],
  }),
  icon: {
    class: 'mr-2',
  },
  submenuicon: ({ props }) => ({
    class: [
      {
        'ml-auto sm:ml-2': props.root,
        'ml-auto': !props.root,
      },
    ],
  }),
  submenu: ({ props }) => ({
    class: [
      // Size
      'w-full sm:w-48',

      // Spacing
      'py-1',
      'm-0 ',
      'list-none',

      // Shape
      'shadow-none sm:shadow-md',
      'border-0',

      // Position
      'static sm:absolute',
      'z-10',
      { 'sm:absolute sm:left-full sm:top-0': props.level > 1 },

      // Color
      'bg-surface-0',
    ],
  }),
  separator: {
    class: 'border-t border-surface-200 my-1',
  },
  button: {
    class: [
      // Flexbox
      'flex sm:hidden',
      'items-center justify-center',

      // Size
      'w-8',
      'h-8',

      // Shape
      'rounded-full',
      // Color
      'text-surface-500/80',

      // States
      'hover:text-surface-600',
      'hover:bg-surface-50',
      'focus:outline-none focus:outline-offset-0',
      'focus:ring-2 focus:ring-inset focus:ring-primary-500',

      // Transitions
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer',
      'no-underline',
    ],
  },
  end: {
    class: 'ml-auto self-center',
  },
};
