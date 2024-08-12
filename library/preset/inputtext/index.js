export default {
  root: ({ props, context, parent }) => ({
    class: [
      'px-3 py-1 w-full bg-transparent',

      // Size
      'h-full',
      {
        'max-h-[43px]': parent.instance?.placeholder?.includes('password'),
      },

      // Font
      'text-grayscale-900 text-xs',
      'placeholder:text-general-200 dark:placeholder:text-general-200',

      'appearance-none',

      // Interactions
      {
        'outline-none focus:ring-primary-500 dark:focus:ring-primary-400':
          !context.disabled,
        'opacity-60 select-none pointer-events-none cursor-default':
          context.disabled,
      },
    ],
  }),
};
