import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import { FetchOptionResponse } from 'lib/components/filtercontainer/FilterContainer.vue.d';
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
  getProjectList: (): Promise<AxiosResponse> => {
    return API().get('/');
  },

  getProjectDetail: (projectId: string): Promise<AxiosResponse> => {
    return API().get(`/detail/${projectId}`);
  },

  getProjectLeaders: (params?: QueryParams): Promise<AxiosResponse> => {
    return API({ params }).get('/team-member/leader');
  },

  getProjectLeadersOptions: (
    params?: QueryParams,
  ): Promise<
    AxiosResponse<
      FetchOptionResponse<{ projectOptions: true; projectManagerOptions: true }>
    >
  > => {
    return API({ params }).get('/team-member/leader/options');
  },
};

export default ProjectServices;
