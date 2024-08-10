export default {
  root: ({ props }) => ({
    class: [
      'flex grow',
      {
        'flex-col': props.layout === 'vertical',
        'flex-row flex-1': props.layout === 'horizontal',
      },
    ],
  }),
  event: ({ props, context }) => ({
    class: [
      'flex relative min-h-[31px]',
      {
        'flex-row-reverse':
          props.align === 'right' ||
          (props.layout === 'vertical' &&
            props.align === 'alternate' &&
            context.index % 2 === 1),
        'flex-col flex-1': props.layout === 'horizontal',
        'flex-col-reverse ':
          props.align === 'bottom' ||
          (props.layout === 'horizontal' &&
            props.align === 'alternate' &&
            context.index % 2 === 1),
      },
    ],
  }),
  opposite: ({ props, context }) => ({
    class: [
      // 'flex-1',
      // {
      //   'px-4': props.layout === 'vertical',
      //   'py-4': props.layout === 'horizontal',
      // },
      {
        'text-right':
          props.align === 'left' ||
          (props.layout === 'vertical' &&
            props.align === 'alternate' &&
            context.index % 2 === 0),
        'text-left':
          props.align === 'right' ||
          (props.layout === 'vertical' &&
            props.align === 'alternate' &&
            context.index % 2 === 1),
      },
    ],
  }),
  separator: ({ props }) => ({
    class: [
      'flex items-center flex-initial',
      {
        'flex-col': props.layout === 'vertical',
        'flex-row': props.layout === 'horizontal',
      },
    ],
  }),
  marker: {
    class: [
      // Display & Flexbox
      'flex self-baseline',

      // Size
      'w-[22px] h-[22px]',

      // Appearance
      'rounded-full border border-general-100 bg-white dark:bg-white',
    ],
  },
  connector: ({ props }) => ({
    class: [
      'grow bg-general-100 dark:bg-general-500',
      {
        'w-[1px]': props.layout === 'vertical',
        'w-full h-[1px]': props.layout === 'horizontal',
      },
    ],
  }),
  content: ({ props, context }) => ({
    class: [
      'flex-1',
      {
        'px-4': props.layout === 'vertical',
        'py-4': props.layout === 'horizontal',
      },
      {
        'text-left':
          props.align === 'left' ||
          (props.layout === 'vertical' &&
            props.align === 'alternate' &&
            context.index % 2 === 0),
        'text-right':
          props.align === 'right' ||
          (props.layout === 'vertical' &&
            props.align === 'alternate' &&
            context.index % 2 === 1),
      },
      {
        'min-h-0':
          props.layout === 'vertical' && context.index === context.count - 1,
        'grow-0':
          props.layout === 'horizontal' && context.index === context.count - 1,
      },
    ],
  }),
};
