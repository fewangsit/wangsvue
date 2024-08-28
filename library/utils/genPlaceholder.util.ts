const bgOptions: string[] = [
  '#57291F',
  '#C0413B',
  '#D77B5F',
  '#FF9200',
  '#FFCD73',
  '#C87505',
  '#F18E3F',
  '#E59579',
  '#C14C32',
  '#80003A',
  '#506432',
  '#FFC500',
  '#B30019',
  '#EC410B',
  '#8CB5B5',
  '#6C3400',
  '#FFA400',
  '#41222A',
  '#FFF7C2',
  '#FFB27B',
  '#FFCD87',
  '#BC7576',
];

export const genRandomPlaceholderBg = (): string => {
  const randomIndex = Math.floor(Math.random() * bgOptions.length);
  return bgOptions[randomIndex];
};

export const genPlaceholder = (
  text: string,
  size: 30 | 125,
  bgColor?: string,
): HTMLCanvasElement => {
  const bg = bgColor ?? genRandomPlaceholderBg();
  const canvas = document.createElement('canvas');

  canvas.style.background = bg;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.font = '600 48px/48px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const horizontalCenter = canvas.width / 2;
    const verticalCenter = (canvas.height + 8) / 2;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.fillText(text, horizontalCenter, verticalCenter);
  }

  return canvas;
};

export default genPlaceholder;
