import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_PROJECT_MODULE_API');

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const ModuleServices = {
  getModuleList: (
    projectId: string,
    params?: Record<string, string | boolean>,
  ): Promise<AxiosResponse> => {
    return API({ params }).get(`/${projectId}/project-detail/module`);
  },
};

export default ModuleServices;
