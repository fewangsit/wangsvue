import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_PROJECT_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/project`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const ProjectServices = {
  getProjectDetail: (projectId: string): Promise<AxiosResponse> => {
    return API().get(`/detail/${projectId}`);
  },
};

export default ProjectServices;
