import { isEmptyObject } from 'lib/utils';

export default {
  root: ({ props }) => ({
    class: ['flex flex-col grow', 'text-xs font-normal text-grayscale-900'],
  }),
  event: ({ props, context }) => ({
    class: [
      'flex relative min-h-[31px] gap-[10px]',
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
    class: 'hidden',
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
      'w-max',
      'rounded-full',
      'bg-transparent',
      'ring-2 ring-inset ring-primary-400 p-0.5',

      'flex items-center justify-center',
    ],
  },
  markerArrow: (item) => ({
    'class': [
      'w-4 h-4 invisible transition-transform duration-200 ease-in-out text-grayscale-900',
      { '!visible': item.detail && !isEmptyObject(item.detail) },
      { 'rotate-180': item.showDetail },
    ],
    'data-wv-section': 'markerArrow',
  }),
  connector: ({ props }) => ({
    class: ['w-[2px] grow bg-grayscale-900'],
  }),
  content: ({ props, context }) => ({
    class: ['flex-1 text-left'],
  }),
};
