import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  CreateTaskDTO,
  EditDescriptionTaskDTO,
  EditTaskDTO,
  EditTaskLinkDTO,
} from 'lib/dto/task.dto';
import { TaskLinkType } from 'lib/types/task.type';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

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

const TaskServices = {
  postCreateTask: (data: CreateTaskDTO): Promise<AxiosResponse> => {
    return API().post('/api/tasks', data);
  },

  putEditTask: (taskId: string, data: EditTaskDTO): Promise<AxiosResponse> => {
    return API().put(`/api/tasks/${taskId}`, data);
  },

  getTaskList: (params?: Record<string, string>): Promise<AxiosResponse> => {
    return API({ params }).get('/api/tasks');
  },

  getTaskDetail: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/api/tasks/${taskId}`);
  },

  getTaskDescription: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/api/tasks/${taskId}/description`);
  },

  putTaskDescription: (
    taskId: string,
    data: EditDescriptionTaskDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/api/tasks/${taskId}/description`, data);
  },

  getTaskDependencies: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/api/task-dependency/task/${taskId}`);
  },

  getTaskLink: (taskId: string, type: TaskLinkType): Promise<AxiosResponse> => {
    return API().get(`/api/task-link/task/${taskId}/${type}`);
  },

  putTaskLink: (
    taskId: string,
    data: EditTaskLinkDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/api/task-link/task/${taskId}`, data);
  },
};

export default TaskServices;
