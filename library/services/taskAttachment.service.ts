/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosProgressEvent, AxiosResponse } from 'axios';
import {
  AddTaskAttachmentFileDTO,
  AddTaskAttachmentUrlDTO,
  UpdateTaskAttachmentCaptionDTO,
} from 'lib/dto/taskAttachment.dto';
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
    baseURL: `${BASE_URL}/api/task-attachments`,
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

const TaskAttachmentServices = {
  getTaskAttachments: (taskId: string): Promise<AxiosResponse> => {
    return API().get(`/task/${taskId}`);
  },
  addTaskAttachmentUrl: (
    taskId: string,
    body: AddTaskAttachmentUrlDTO,
  ): Promise<AxiosResponse> => {
    return API().post(`/task/${taskId}/url`, body);
  },
  addTaskAttachmentFile: (payload: {
    id: string; // Task id
    body: AddTaskAttachmentFileDTO;
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
    signal: AbortSignal;
  }): Promise<AxiosResponse> => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    return API({
      headers,
      onUploadProgress: payload.onUploadProgress,
      signal: payload.signal,
    }).post(`/task/${payload.id}/file`, payload.body);
  },
  updateTaskAttachmentCaption: (
    taskId: string,
    body: UpdateTaskAttachmentCaptionDTO,
  ): Promise<AxiosResponse> => {
    return API().put(`/${taskId}/caption`, body);
  },
  deleteTaskAttachment: (attachmentId: string): Promise<AxiosResponse> => {
    return API().delete(`/${attachmentId}`);
  },
};

export default TaskAttachmentServices;
