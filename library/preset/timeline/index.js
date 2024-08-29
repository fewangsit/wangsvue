import { isEmptyObject } from 'lib/utils';

export default {
  root: ({ props }) => ({
    class: ['flex flex-col grow', 'text-xs font-normal text-grayscale-900'],
  }),
  event: ({ props, context }) => ({
    class: ['grid grid-cols-[max-content,1fr] gap-x-[10px] gap-y-1'],
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
    class: ['grid grid-rows-[max-content,auto] pb-3'],
  }),
};
