import InputTextPreset from '../inputtext/index.js';
/**
 * To set different ring width for Firefox Browser
 * Also for InputGroupAddon
 */
const isFirefoxBased = navigator.userAgent.includes('Firefox');

export default {
  root: ({ context }) => ({
    class: [
      'flex flex-wrap gap-x-0.5 gap-y-[5px] items-center',
      'min-h-[26px] h-fit w-full',
      'ring-inset rounded px-[12px] py-[2px]',
      {
        'ring-[1px]': isFirefoxBased,
        'ring-[0.5px]': !isFirefoxBased,
      },
      { '!ring-danger-500 !dark:ring-danger-500': context.invalidInput },
      { '!ring-general-200 !dark:ring-general-200': !context.invalidInput },
      { 'pointer-events-none': context.disabled },
    ],
  }),
  input: ({ context, parent, props }) => ({
    class: [
      ...InputTextPreset.root({
        props,
        context,
        parent,
      }).class,
      'outline-none !w-full !bg-transparent !p-0 !shadow-none h-max !leading-4 min-w-[70px]',
      { 'placeholder:text-transparent': context.value?.length },
      'focus:placeholder:text-general-200',
    ],
  }),
  erroricon: {
    class: ['mr-1 text-warning-600 text-base'],
  },
  erroroverlaypanel: {
    class: ['px-3 py-1 text-[12px] text-general-800'],
  },
};
