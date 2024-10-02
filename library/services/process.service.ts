import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_PROJECT_PROCESS_API');

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

const ProcessServices = {
  getProcessList: (
    projectId: string,
    params?: Record<string, string>,
    isActive: 'active' | 'nonactive' = 'active',
  ): Promise<AxiosResponse> => {
    return API({ params }).get(
      `/project-details/process/${projectId}/${isActive}`,
    );
  },
};

export default ProcessServices;
