import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import {
  AddTaskChecklistDTO,
  AddTaskChecklistItemDTO,
  AddTaskChecklistTemplateDTO,
  ToggleTaskChecklistItemDTO,
  UpdateTaskChecklistDTO,
  UpdateTaskChecklistItemDTO,
} from 'lib/dto/taskChecklist.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api/task-checklists`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const TaskChecklistServices = {
  getTaskChecklists: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/task/${taskId}`);
  },

  addTaskChecklist: (body: AddTaskChecklistDTO): Promise<AxiosResponse> => {
    return API().post('/', body);
  },

  updateTaskChecklist: (
    checklistId: string,
    body: UpdateTaskChecklistDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/${checklistId}`, body);
  },

  deleteTaskChecklist: (
    checklistId: string,
    reason: string,
  ): Promise<AxiosResponse> => {
    return API().put(`/${checklistId}/delete`, { reason });
  },

  addTaskChecklistItem: (
    body: AddTaskChecklistItemDTO,
  ): Promise<AxiosResponse> => {
    return API().post('/checklist-item', body);
  },

  updateTaskChecklistItem: (
    checklistItemId: string,
    body: UpdateTaskChecklistItemDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/checklist-item/${checklistItemId}`, body);
  },

  deleteTaskChecklistItem: (
    checklistItemId: string,
    reason: string,
  ): Promise<AxiosResponse> => {
    return API().put(`/checklist-item/${checklistItemId}/delete`, { reason });
  },

  toggleTaskChecklistItem: (
    checklistItemId: string,
    body: ToggleTaskChecklistItemDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/checklist-item/${checklistItemId}/checked-status`, body);
  },

  getTaskChecklistTemplates: (
    projectId: string,
    params?: QueryParams,
  ): Promise<AxiosResponse> => {
    return API({ params }).get(`/template/project/${projectId}`);
  },

  addTaskChecklistTemplate: (
    body: AddTaskChecklistTemplateDTO,
  ): Promise<AxiosResponse> => {
    return API().post('/template', body);
  },

  deleteTaskChecklistTemplate: (templateId: string): Promise<AxiosResponse> => {
    return API().delete(`/template/${templateId}`);
  },
};

export default TaskChecklistServices;
