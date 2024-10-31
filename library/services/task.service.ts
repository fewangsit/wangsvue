import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  FetchResponse,
  QueryParams,
} from 'lib/components/datatable/DataTable.vue.d';
import {
  Task,
  TaskOptions,
} from 'lib/components/dialogdetailpbi/DialogDetailPbi.vue.d';
import { FetchOptionResponse } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};
  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${user.jwt}`,
      ...headers,
    },
    params,
  });

  return instance;
};

const TaskServices = {
  getTasks: (
    query: QueryParams,
  ): Promise<AxiosResponse<FetchResponse<Task>>> => {
    return API().get('/tasks', {
      params: query,
    });
  },

  getTaskOptions: (
    params: TaskOptions,
  ): Promise<AxiosResponse<FetchOptionResponse<TaskOptions>>> => {
    return API({ params }).get('tasks/options');
  },
};

export default TaskServices;
