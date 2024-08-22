const getImageURL = (name?: string | null): string | undefined => {
  if (!name) return;

  const BASE_URL = 'https://dev-api-file-manager.tagsamurai.com';
  return `${BASE_URL}/v2/files/${name}`;
};

const bgOptions: string[] = [
  '57291F',
  'C0413B',
  'D77B5F',
  'FF9200',
  'FFCD73',
  'C87505',
  'F18E3F',
  'E59579',
  'C14C32',
  '80003A',
  '506432',
  'FFC500',
  'B30019',
  'EC410B',
  '8CB5B5',
  '6C3400',
  'FFA400',
  '41222A',
  'FFF7C2',
  'FFB27B',
  'FFCD87',
  'BC7576',
];

export const genRandomPlaceholderBg = (): string => {
  const randomIndex = Math.floor(Math.random() * bgOptions.length);
  return bgOptions[randomIndex];
};

export const genPlaceholder = (
  text: string,
  size: 30 | 125,
  bgColor?: string,
): string => {
  const bg = bgColor ?? genRandomPlaceholderBg();

  return `https://placehold.jp/48/${bg}/ffffff/${size}x${size}.png?text=${text.slice(0, 3)}%0A%0A&css=%7B%22font-weight%22%3A%22%20600%22%2C%22line-height%22%3A%22%20${size}px%22%7D`;
};

export default getImageURL;
