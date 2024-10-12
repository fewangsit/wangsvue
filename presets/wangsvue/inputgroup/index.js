/**
 * To set different ring width for Firefox Browser
 * Also for InputGroupAddon
 */
const isFirefoxBased = navigator.userAgent.includes('Firefox');

export default {
  root: ({ props }) => ({
    'class': [
      {
        '!ring-danger-500 [&_.inputgroupaddon]:ring-danger-500':
          props.invalid && props.ring != 'none',
        '[&_.inputgroupaddon]:ring-general-400':
          !props.invalid && props.ring != 'none',
        '!bg-general-50 ': props.disabled,
      },
      {
        '[&:has(:focus)]:!ring-primary-400 [&:has(:focus)_.inputgroupaddon]:!ring-primary-400':
          props.ring != 'none',
      },
      {
        'ring-[1px] [&_.inputgroupaddon]:ring-[1px]':
          isFirefoxBased && props.ring != 'none',
        'ring-[0.5px] [&_.inputgroupaddon]:ring-[0.5px]':
          !isFirefoxBased && props.ring != 'none',
      },
      '[&:has(input)]:cursor-text',
      'h-[30px]',
      'flex items-stretch',
      'w-full',
      'ring-inset ring-general-400 rounded',
      'bg-white',
      props.class,
    ],
    'data-wv-section': 'input-group',
  }),
};
