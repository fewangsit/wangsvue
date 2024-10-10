export default {
  // :class="['ts-form', { 'sticky-buttons': props.stickyButtons }]"
  'root': () => ({
    'class': [
      'flex flex-col gap-3 text-general-900 text-[0.75rem] font-medium leading-[16.8px]',
    ],
    'data-wv-section': 'root',
  }),
  'fields': {
    class: ['grid gap-y-3 gap-x-6'],
  },
  'footer': {
    class: ['flex flex-col self-end gap-3'],
  },
  'action-buttons': {
    class: ['relative flex flex-col items-end justify-end gap-1'],
  },
  'button-wrapper': {
    class: ['flex items-end justify-end gap-1'],
  },
  'validator-message': {
    class: ['static w-max transform-none'],
  },
};
