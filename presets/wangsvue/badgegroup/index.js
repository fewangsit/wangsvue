import dialog from '../dialog/index';

export default {
  root: {
    'class': 'flex flex-nowrap items-center gap-1',
    'data-wv-name': 'badgegroup',
    'data-wv-section': 'root',
  },
  showmorebutton: {
    'class': '!p-1 !h-auto',
    'data-wv-section': 'showmorebutton',
  },

  showmoredialog: {
    root: {
      'class': [dialog.root({ state: {} }).class, 'w-[400px] !px-6 !py-3'],
      'data-wv-section': 'showmoredialog',
    },
    title: {
      'class': ['text-general-900 text-sm font-semibold leading-5'],
      'data-wv-section': 'showmoredialogtitle',
    },
    content: {
      'class': ['flex flex-wrap gap-1'],
      'data-wv-section': 'showmoredialogcontent',
    },

    // All section in Dialog Preset can be added here
  },
};
