import axios, { AxiosInstance, AxiosProgressEvent, AxiosResponse } from 'axios';
import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';
import {
  AddTaskChecklistAttachmentFileDTO,
  AddTaskChecklistAttachmentUrlDTO,
  AddTaskChecklistDTO,
  AddTaskChecklistItemDTO,
  AddTaskChecklistTemplateDTO,
  ToggleTaskChecklistItemDTO,
  UpdateTaskChecklistDTO,
  UpdateTaskChecklistItemDTO,
} from 'lib/dto/taskChecklist.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

type AxiosInstanceOptions = {
  headers?: Record<string, string>;
  params?: any;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: AbortSignal;
};

const API = (options?: AxiosInstanceOptions): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api/task-checklists`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...options?.headers,
    },
    params: options?.params,
    onUploadProgress: options?.onUploadProgress,
    signal: options?.signal,
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

  addTaskAttachmentFile: (payload: {
    body: AddTaskChecklistAttachmentFileDTO;
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
    signal: AbortSignal;
  }): Promise<AxiosResponse> => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    return API({
      headers,
      onUploadProgress: payload.onUploadProgress,
      signal: payload.signal,
    }).post('/checklist-item/attachment/file', payload.body);
  },

  addTaskAttachmentUrl: (
    id: string,
    body: AddTaskChecklistAttachmentUrlDTO,
  ): Promise<AxiosResponse> => {
    return API().post('/checklist-item/attachment/url', body);
  },

  deleteTaskAttachment: (attachmentId: string): Promise<AxiosResponse> => {
    return API().delete(`/checklist-item/attachment/${attachmentId}`);
  },
};

export default TaskChecklistServices;
