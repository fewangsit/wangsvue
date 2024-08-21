import colors from '../colors.config.json';
const getImageURL = (name?: string | null): string | undefined => {
  if (!name) return;

  const BASE_URL = 'https://dev-api-file-manager.tagsamurai.com';
  return `${BASE_URL}/v2/files/${name}`;
};

export const genPlaceholder = (text: string, size: 30 | 125): string => {
  const bgOptions: string[] = [
    colors['primary-400'],
    colors['danger-500'],
    colors['success-500'],
    colors['general-500'],
    colors['grayscale-900'],
  ];

  const randomIndex = Math.floor(Math.random() * bgOptions.length);
  const bg = bgOptions[randomIndex].replace('#', '');

  return `https://placehold.jp/48/${bg}/ffffff/${size}x${size}.png?text=${text.slice(0, 2)}%0A%0A&css=%7B%22font-weight%22%3A%22%20600%22%2C%22line-height%22%3A%22%20${size}px%22%7D`;
};

export default getImageURL;
