export default {
  root: {
    class: [
      // Alignment
      'flex items-center',
      'gap-[6px]',
    ],
  },
  input: {
    root: ({ props, context, parent }) => ({
      class: [
        // Font
        'leading-none font-medium',

        // Flex & Alignment
        { 'flex-1 w-[1%]': parent.instance.$name == 'InputGroup' },
        'text-center',

        // Spacing
        'm-0',
        {
          'p-3': props.size == null,
        },

        // Size
        'w-[42px] h-[42px] text-base',

        // Shape
        { 'rounded-md': parent.instance.$name !== 'InputGroup' },
        {
          'first:rounded-l-md rounded-none last:rounded-r-md':
            parent.instance.$name == 'InputGroup',
        },
        {
          'border-0 border-y border-l last:border-r':
            parent.instance.$name == 'InputGroup',
        },
        {
          'first:ml-0 ml-[-1px]':
            parent.instance.$name == 'InputGroup' && !props.showButtons,
        },

        // Colors
        'text-general-800 dark:text-general-800',
        'placeholder:text-surface-400 dark:placeholder:text-surface-500',
        'bg-white dark:bg-white',
        'border',
        { 'border-general-200 dark:border-general-200': !props.invalid },

        // Invalid State
        { 'border-danger-500 dark:border-danger-500': props.invalid },

        // States
        {
          // 'hover:border-primary-500 dark:hover:border-primary-400': !context.disabled && !props.invalid,
          'focus:outline-none focus:outline-offset-0': !context.disabled,
          'opacity-60 select-none pointer-events-none cursor-default':
            context.disabled,
        },

        // Filled State *for FloatLabel
        { filled: parent.instance?.$name == 'FloatLabel' && context.filled },

        // Misc
        'appearance-none',
        'transition-colors duration-200',
      ],
    }),
  },
};
