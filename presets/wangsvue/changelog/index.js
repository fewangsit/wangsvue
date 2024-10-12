export default {
  button: (buttonClass) => ({
    'class': [buttonClass, 'w-max'],
    'data-wv-section': 'changelog-button',
  }),
  icon: {
    class: ['text-2xl'],
  },
  dialog: {
    'class': 'w-[800px] !z-50',
    'data-wv-name': 'changelog-dialog',
  },
  root: {
    class: 'flex flex-col gap-2 justify-between',
  },
  header: {
    'class': 'flex justify-end gap-1 items-center',
    'data-wv-section': 'changelog-dialog-header',
  },
  buttonsearch: {
    'data-wv-section': 'changelog-dialog-button-search',
  },
  buttonfilter: {
    'data-wv-section': 'changelog-dialog-button-filter',
  },
  buttondownload: {
    'data-wv-section': 'changelog-dialog-button-download',
  },
};
