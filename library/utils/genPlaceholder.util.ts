import sharp from 'sharp';

const genPlaceholder = async (text: string, size: number): Promise<string> => {
  const bgOptions = [
    'primary-400',
    'danger-500',
    'success-500',
    'general-500',
    'grayscale-900',
  ];

  const randomIndex = Math.floor(Math.random() * bgOptions.length);
  const bg = bgOptions[randomIndex];

  const image = sharp({
    create: {
      width: size,
      height: size,
      channels: 4, // RGBA
      background: bg,
    },
  });

  const textBuffer = await sharp({
    raw: {
      width: size,
      height: size,
      channels: 4,
    },
  })
    .resize(size, size)
    .flatten()
    .composite([
      {
        input: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="30" fill="white" font-weight="semibold">' +
            text +
            '</text></svg>',
        ),
        top: 0,
        left: 0,
        blend: 'multiply',
      },
    ])
    .toBuffer();

  return await image
    .composite([{ input: textBuffer, blend: 'multiply', top: 0, left: 0 }])
    .toBuffer()
    .then((buffer) => {
      const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
      return dataUrl;
    });
};

export default genPlaceholder;
