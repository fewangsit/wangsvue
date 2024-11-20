import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ShortFetchResponse } from 'lib/components/datatable/DataTable.vue.d';
import { EditTaskLinkDTO } from 'lib/dto/task.dto';
import { TaskLinkChangelogItem, TaskLinkType } from 'lib/types/task.type';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api/task-link/task`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const TaskLinkServices = {
  getTaskLink: (taskId: string, type: TaskLinkType): Promise<AxiosResponse> => {
    return API().get(`/${taskId}/${type}`);
  },

  putTaskLink: (
    taskId: string,
    data: EditTaskLinkDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/${taskId}`, data);
  },

  getTaskLinkChangelog: (
    taskId: string,
    type: TaskLinkType,
  ): Promise<AxiosResponse<ShortFetchResponse<TaskLinkChangelogItem>>> => {
    return API().get(`/${taskId}/${type}/change-log`);
  },
};

export default TaskLinkServices;
