/**
 * Retrieves the base URL from environment variables.
 *
 * @param env - The environment variable name without the platform prefix.
 * @returns The base URL for the specified environment.
 * @example 'APP_EXAMPLE_API'
 */
export const getBaseURL = (env: string): string | undefined => {
  return import.meta.env['VITE_' + env];
};
