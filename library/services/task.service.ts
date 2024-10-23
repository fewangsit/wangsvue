import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  CreateTaskDTO,
  EditDescriptionTaskDTO,
  EditTaskDTO,
} from 'lib/dto/task.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api/tasks`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const TaskServices = {
  postCreateTask: (data: CreateTaskDTO): Promise<AxiosResponse> => {
    return API().post('/', data);
  },

  putEditTask: (taskId: string, data: EditTaskDTO): Promise<AxiosResponse> => {
    return API().put(`/${taskId}`, data);
  },

  getTaskList: (params?: Record<string, string>): Promise<AxiosResponse> => {
    return API({ params }).get('/');
  },

  getTaskOptions: (
    params?: Record<string, string | boolean>,
  ): Promise<AxiosResponse> => {
    return API({ params }).get('/options');
  },

  getTaskDetail: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/${taskId}`);
  },

  getTaskDescription: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/${taskId}/description`);
  },

  putTaskDescription: (
    taskId: string,
    data: EditDescriptionTaskDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/${taskId}/description`, data);
  },

  deleteTask: (taskId: string): Promise<AxiosResponse> => {
    const params = { id: JSON.stringify([taskId]) };
    return API({ params }).delete('/delete');
  },
};

export default TaskServices;