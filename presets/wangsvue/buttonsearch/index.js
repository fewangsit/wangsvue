export default {
  buttontrigger: (buttonFocusClass, showSearchInput) => ({
    'class': [{ 'w-max': !showSearchInput }, buttonFocusClass],
    'data-wv-section': 'buttonsearchtrigger',
  }),
  buttonclose: (buttonFocusClass, query) => ({
    'class': [buttonFocusClass, { invisible: !query }],
    'data-wv-section': 'buttonsearchclose',
  }),
  buttonsubmit: { class: 'hidden' },
  icon: (showSearchInput) => ({
    class: [
      { 'text-2xl': !showSearchInput },
      { 'w-6 h-6 text-grayscale-900 shrink-0': showSearchInput },
    ],
  }),
  iconclose: { class: ['text-2xl shrink-0'] },
  form: (showSearchInput) => ({
    'class': [
      { show: showSearchInput },
      'grid grid-cols-[max-content,auto,max-content] items-center gap-0.5 max-w-[224px] h-6',
      'border-b border-primary-100',
    ],
    'data-wv-section': 'searchbox-form',
  }),
  inputtext: {
    class: '!h-max',
  },
};
