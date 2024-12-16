import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

export interface APIRequestConfig extends Omit<AxiosRequestConfig, 'env'> {
  /**
   * Retrieves the base URL from environment variables.
   *
   * @param env - The environment variable name.
   * @example 'APP_EXAMPLE_API'
   */
  env?: string;

  /**
   * The endpoint prefix that appears on every endpoint.
   * This could include API base paths or versioning groups for endpoints.
   *
   * @example '/api', '/v2'
   */
  prefix?: string;
}

const createAPI = (config: APIRequestConfig = {}): AxiosInstance => {
  const { env = '', prefix = '', headers = {}, ...restConfig } = config;

  const baseURL = `${getBaseURL(env)}/${prefix}`.replaceAll('//', '/');
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  const token = user.token ?? '';

  return axios.create({
    ...restConfig,
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...headers,
    },
  });
};

export default createAPI;
