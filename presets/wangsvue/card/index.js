export default {
  root: {
    class: [
      //Shape
      'rounded-lg p-6',

      'flex flex-col gap-y-3',

      //Color
      'bg-white',
      'text-grayscale-900',
    ],
  },
  header: {
    class: [''],
  },
  body: {
    class: 'flex flex-col gap-3',
  },
  title: {
    class: 'text-2xl font-bold',
  },
  subtitle: {
    class: ['text-sm font-normal'],
  },
  content: {
    class: 'flex flex-col gap-3 text-xs text-grayscale-900',
  },
  footer: {
    class: ['inline-flex gap-1 text-xs items-center'],
  },
};
