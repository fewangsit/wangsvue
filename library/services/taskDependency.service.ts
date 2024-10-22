import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { UpdateTaskDependencyDTO } from 'lib/dto/taskDependency.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api/task-dependency/task`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const TaskDependencyServices = {
  getTaskDependencies: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/${taskId}`);
  },
  updateTaskDependencies: (
    taskId: string,
    body: UpdateTaskDependencyDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/${taskId}`, body);
  },
};

export default TaskDependencyServices;
