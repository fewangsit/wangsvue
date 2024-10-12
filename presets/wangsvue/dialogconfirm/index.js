export default {
  root: {
    'class': ['!w-[clamp(360px,75vw,400px)]'],
    'data-wv-name': (attrsDataName) => attrsDataName ?? 'root',
    'data-wv-section': (attrsDataSection) =>
      attrsDataSection ?? 'dialogconfirm',
  },
  header: {
    'data-wv-section': 'dialog-confirm-header',
  },
  headericon: { 'class': 'text-2xl', 'data-wv-section': 'headericon' },
  headertitle: (severity) => ({
    'class': [
      'text-base leading-none font-semibold',
      {
        'text-success-700': severity === 'success',
        'text-danger-700': severity === 'danger',
      },
    ],
    'data-wv-section': 'dialog-confirm-title',
  }),
  content: {
    'class': '[&_ul]:list-inside [&_ul]:list-disc [&_ul_li]:pl-[6px]',
    'data-wv-section': 'dialog-confirm-content',
  },
  list: {
    'data-wv-section': 'dialog-confirm-list',
  },
  bodymessage: {
    'data-wv-section': 'confirm-message',
  },
  cancelbutton: {
    'data-wv-section': 'cancel-button',
  },
  confirmbutton: {
    'data-wv-section': 'confirm-button',
  },
  footer: {
    'class': 'flex items-end justify-end gap-1 !mt-0',
    'data-wv-section': 'dialog-confirm-footer',
  },
};
