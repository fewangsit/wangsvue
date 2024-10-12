export default {
  root: {
    'class': ['max-w-[90vw]'],
    'style': (computedWidth) => `width: ${computedWidth}`,
    'data-wv-section': 'dialog-form',
  },
  header: {
    'class': 'flex items-center gap-2',
    'data-wv-section': 'dialog-form-header',
  },
  headericon: { 'class': 'text-2xl', 'data-wv-section': 'headericon' },
  headertitle: {
    'class':
      'mr-auto text-grayscale-900 text-center text-[0.9rem] leading-[1.125rem] !font-semibold tracking-[0.28px]',
    'data-wv-section': 'dialog-form-title',
  },
  expandasidebutton: {
    'class': ['!px-1.5 !py-1 -mr-1.5 !text-xs'],
    'data-wv-section': 'expand-aside-button',
  },
  closedialog: {
    'class': '!p-0.5 !text-general-200',
    'data-wv-section': 'closebutton',
  },
  container: (expanded) => ({
    'class': [
      'flex overflow-y-auto overflow-x-hidden scrollbar-w-none',
      { 'gap-6': expanded },
    ],
    'data-wv-section': 'dialog-form-container',
  }),
  mainsection: {
    'class': ['flex flex-col gap-3 w-full'],
    'data-wv-section': 'dialog-form-main',
  },
  asidesection: (expanded, asideRightWidth) => ({
    'class': [
      'flex flex-col gap-3 shrink-0',
      { 'opacity-0': !expanded },
      { 'opacity-100': expanded },
    ],
    'style': `width: ${expanded ? asideRightWidth - 24 : 0}px`,
    'data-wv-section': 'dialog-form-aside',
  }),
  form: {
    'class': 'overflow-y-auto',
    'style': 'scrollbar-width: none !important',
    'data-wv-section': 'form',
  },
  footer: {
    'class': 'flex flex-col gap-3 items-end justify-center',
    'data-wv-section': 'dialog-form-footer',
  },
  footerbutton: {
    'class': 'flex gap-1 items-center justify-end',
    'data-wv-section': 'footer-button',
  },
  cancelbtn: {
    'data-wv-section': 'cancel-btn',
  },
  clearfield: {
    'data-wv-section': 'clear-field',
  },
  savesubmitbutton: {
    'data-wv-section': 'save-submit-button',
  },
};
