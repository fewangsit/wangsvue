import { JSONContent } from 'lib/components/editor/Editor.vue.d';
import getImageURL from './getImageURL.util';

const convertJsonImage = (
  content: JSONContent | JSONContent[],
): JSONContent | JSONContent[] => {
  if (Array.isArray(content)) {
    const returnArray: JSONContent[] = [];
    for (const item of content) {
      returnArray.push(convertJsonImage(item));
    }
    return returnArray;
  } else if (content.content) {
    return {
      ...content,
      content: convertJsonImage(content.content) as JSONContent[],
    };
  } else if (
    content.attrs?.src &&
    (content.attrs?.src as string).startsWith('/productBacklogItems/image')
  ) {
    return {
      ...content,
      attrs: {
        ...content.attrs,
        src: getImageURL(content.attrs.src),
      },
    };
  }
  return content;
};

export default convertJsonImage;
