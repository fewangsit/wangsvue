export default {
  root: {
    'data-wv-name': 'fileupload',
    'data-wv-section': 'root',
  },
  wrapper: {
    'class': ['w-full'],
    'data-wv-section': 'wrapper',
  },
  input: ({ state }) => ({
    class: [
      {
        '': state.fileName != null,
      },
    ],
  }),
  buttonupload: ({ props }) => ({
    class: [{ 'mb-[21px]': props.fileExtensions || props.fileRequirements }],
  }),
  requirements: {
    class: 'flex w-full justify-start',
  },
};
