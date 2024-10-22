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
  'fields-wrapper': {
    'class': ['grid gap-y-3 gap-x-6'],
    'data-wv-section': 'fields',
  },
  'footer': {
    class: ['flex flex-col self-end gap-3'],
  },
  'action-buttons': {
    'class': ['relative flex flex-col items-end justify-end gap-1'],
    'data-wv-section': 'action-buttons',
  },
  'button-wrapper': {
    'class': ['flex items-end justify-end gap-1'],
    'data-wv-section': 'button-wrapper',
  },
  'cancel-button': {
    'data-wv-section': 'cancel-button',
  },
  'clear-button': {
    'data-wv-section': 'clear-button',
  },
  'submit-button': {
    'data-wv-section': 'submit-button',
  },
  'staycheckbox': {
    class: ['cursor-pointer flex gap-2 w-max ml-auto items-center justify-end'],
  },
  'validator-message': {
    class: ['static w-max transform-none'],
  },
};
