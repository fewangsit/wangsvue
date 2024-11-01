import { WangsIcons } from 'lib/components/icon/Icon.vue.d';

/**
 *
 * @param filename {string}
 * @returns
 */
const getAttachmentIcon = (filename: string): WangsIcons => {
  const splittedFilename = filename.split('.');

  if (!splittedFilename.length) return 'data';

  const fileExtension = splittedFilename[splittedFilename.length - 1];

  switch (fileExtension) {
    case 'pdf':
      return 'pdf';
    case 'xls':
    case 'xlsx':
      return 'xls';
    case 'doc':
    case 'docx':
      return 'doc';
    default:
      return 'data';
  }
};

export default getAttachmentIcon;
