const getImageURL = (name?: string | null): string | undefined => {
  if (!name) return;

  const BASE_URL = 'https://dev-api-file-manager.tagsamurai.com';
  return `${BASE_URL}/v2/files/${name}`;
};

export default getImageURL;
