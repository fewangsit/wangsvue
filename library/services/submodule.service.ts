import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { UpdateTimelineTaskTransferBody } from 'lib/types/subModule.type';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_PROJECT_SUB_MODULE_API');

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

const SubModuleServices = {
  getSubmoduleList: (
    projectId: string,
    params?: Record<string, string>,
  ): Promise<AxiosResponse> => {
    return API({ params }).get(`/${projectId}/project-detail/sub-module`);
  },
  getSubmoduleOptions: (
    projectId: string,
    params?: Record<string, boolean>,
  ): Promise<AxiosResponse> => {
    return API({ params }).get(
      `/${projectId}/project-detail/sub-module/options`,
    );
  },

  putTimelineTaskTransfer: async (
    subModuleId: string,
    body: UpdateTimelineTaskTransferBody,
  ): Promise<AxiosResponse> => {
    return API().put(`/sub-module/${subModuleId}/timeline/task-transfer`, body);
  },
};

export default SubModuleServices;
