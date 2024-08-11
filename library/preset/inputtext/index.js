export default {
  root: ({ props, context, parent }) => ({
    'class': [
      'flex py-1 px-3 items-center space-x-1 flex-shrink-0 self-stretch rounded bg-transparent w-full',

      // Size
      'h-full',
      {
        // 'max-h-[26px]': !parent.instance?.placeholder?.includes('password'),
        'max-h-[26px]': !parent.instance?.placeholder?.includes('password'),
        'max-h-[43px]': parent.instance?.placeholder?.includes('password'),
      },

      // Font
      'text-grayscale-900 text-xs !font-medium',
      'placeholder:text-general-200 dark:placeholder:text-general-200 placeholder:!font-normal',

      // Colors
      // {
      //   'ring-1 ring-inset ring-surface-300 dark:ring-surface-700 ring-offset-0':
      //     parent.instance.$name !== 'InputGroup',
      // },

      // Shape
      // { 'rounded-md': parent.instance.$name !== 'InputGroup' },
      // {
      //   'first:rounded-l-md rounded-none last:rounded-r-md':
      //     parent.instance.$name == 'InputGroup',
      // },
      // {
      //   'border-0 border-y border-l last:border-r border-surface-300 dark:border-surface-600':
      //     parent.instance.$name == 'InputGroup',
      // },
      // {
      //   'first:ml-0 ml-[-1px]':
      //     parent.instance.$name == 'InputGroup' && !props.showButtons,
      // },
      'appearance-none',

      // Interactions
      {
        'outline-none focus:ring-primary-500 dark:focus:ring-primary-400':
          !context.disabled,
        'opacity-60 select-none pointer-events-none cursor-default':
          context.disabled,
      },
    ],
    'data-test': 'ts-inputtext',
  }),
};
