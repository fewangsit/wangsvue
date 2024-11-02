import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AddTaskApiDTO, UpdateTaskApiDTO } from 'lib/dto/taskApi.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/task-api`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const TaskApiServices = {
  getTaskAPIs: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/${taskId}`);
  },

  addTaskAPI: (body: AddTaskApiDTO): Promise<AxiosResponse> => {
    return API().post('/', body);
  },

  updateTaskAPI: (
    taskApiId: string,
    body: UpdateTaskApiDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/${taskApiId}`, body);
  },

  deleteTaskAPI: (taskApiId: string): Promise<AxiosResponse> => {
    return API().delete(`/${taskApiId}`);
  },
};

export default TaskApiServices;
