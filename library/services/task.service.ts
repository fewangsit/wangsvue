import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  CreateTaskDTO,
  EditDescriptionTaskDTO,
  EditTaskDTO,
  ReviewTaskDTO,
  UpdateTaskMemberDTO,
} from 'lib/dto/task.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';
import {
  FetchResponse,
  QueryParams,
} from 'lib/components/datatable/DataTable.vue.d';
import {
  Task,
  TaskOptions,
} from 'lib/components/dialogdetailpbi/DialogDetailPbi.vue.d';
import { FetchOptionResponse } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import {
  TaskTableSubTab,
  TaskTableTab,
} from 'lib/components/tasktable/TaskTable.vue.d';
import {
  TaskTableFamilyResponse,
  TaskTableItem,
  TaskTableOptionQuery,
} from 'lib/types/task.type';

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

  updateTaskMember: (data: UpdateTaskMemberDTO): Promise<AxiosResponse> => {
    return API().put('/assignee', data);
  },

  getTaskList: (params?: Record<string, string>): Promise<AxiosResponse> => {
    return API({ params }).get('/');
  },

  getTaskOptions: (
    params: TaskOptions,
  ): Promise<AxiosResponse<FetchOptionResponse<TaskOptions>>> => {
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

  markTaskAsDone: (taskId: string): Promise<AxiosResponse> => {
    return API().put(`/${taskId}/done`);
  },

  deleteTask: (taskIds: string[]): Promise<AxiosResponse> => {
    const params = { id: JSON.stringify(taskIds) };
    return API({ params }).delete('/delete');
  },

  reviewTask: (taskId: string, body: ReviewTaskDTO): Promise<AxiosResponse> => {
    return API().put(`/${taskId}/review`, body);
  },

  reportBugTask: (
    taskId: string,
    body: { note: string },
  ): Promise<AxiosResponse> => {
    return API().put(`/${taskId}/report-bug`, body);
  },

  getTaskReview: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/${taskId}/review`);
  },

  getTasks: (
    query: QueryParams,
  ): Promise<AxiosResponse<FetchResponse<Task>>> => {
    return API().get('/', {
      params: query,
    });
  },

  getTasksByTab: (args: {
    tab: TaskTableTab;
    subTab?: TaskTableSubTab;
    query?: QueryParams;
  }): Promise<AxiosResponse<FetchResponse<TaskTableItem>>> => {
    const { tab, query, subTab } = args;
    const endpoint = subTab ? `/${tab}/${subTab}` : `/${tab}`;
    return API().get(endpoint, {
      params: query,
    });
  },

  getTaskOptionsByTab: (args: {
    tab: TaskTableTab;
    subTab?: TaskTableSubTab;
    query?: TaskTableOptionQuery;
  }): Promise<AxiosResponse<FetchResponse>> => {
    const { tab, query, subTab } = args;
    const endpoint = subTab ? `/${tab}/${subTab}/options` : `/${tab}/options`;
    return API().get(endpoint, {
      params: query,
    });
  },

  getTasksByUser: (args: {
    userId: string;
    tab: TaskTableTab;
    query?: QueryParams;
  }): Promise<AxiosResponse<FetchResponse<TaskTableItem>>> => {
    const { tab, query, userId } = args;
    return API().get(`/${tab}/user/${userId}`, {
      params: query,
    });
  },

  getTaskOptionsByUser: (args: {
    userId: string;
    tab: TaskTableTab;
    query?: TaskTableOptionQuery;
  }): Promise<AxiosResponse<FetchResponse>> => {
    const { tab, query, userId } = args;
    return API().get(`/${tab}/user/${userId}/options`, {
      params: query,
    });
  },

  getTaskFamily: (
    taskId: string,
  ): Promise<AxiosResponse<TaskTableFamilyResponse>> => {
    return API().get(`/${taskId}/family`);
  },

  restoreTasks: (taskIds: string[]): Promise<AxiosResponse> => {
    return API({
      params: { id: JSON.stringify(taskIds) },
    }).put('/restore');
  },
};

export default TaskServices;
