/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CreateTaskDTO } from 'lib/dto/task.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

// Const user = JSON.parse(localStorage.getItem('user')!);
const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  // TODO: Remove this on production.
  user.jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzgzM2YwMjg3NTRjNGY3NTUzMmYwMCIsImlhdCI6MTcyNDM5NjcxOX0._2YP7q8kZNmJdegSwpFNRcIHs2P-DV9EUhsr9HOmvaw';

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
};

export default TaskServices;
