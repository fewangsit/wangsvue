const getImageURL = (
  name?: string | null,
  width?: number,
): string | undefined => {
  if (!name) return;

  const BASE_URL = import.meta.env.VITE_APP_WANGSIT_FILES_API;
  return `${BASE_URL}/files${width ? '/' + width : ''}${name}`;
};

export default getImageURL;
