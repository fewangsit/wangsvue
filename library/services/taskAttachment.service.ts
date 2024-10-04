/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AddTaskAttachmentFileDTO,
  AddTaskAttachmentUrlDTO,
  UpdateTaskAttachmentCaptionDTO,
} from 'lib/dto/taskAttachment.dto';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

// Const user = JSON.parse(localStorage.getItem('user')!);
const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  // TODO: Remove this on production.
  user.jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE3NzFjMWViZTUzNDRiYzJiOWRhYiIsImlhdCI6MTcyODAyNDY0OCwiZXhwIjoxNzI4MTExMDQ4fQ.gb6uduDurMDMsLN81unm1a6muDSMaVucZ7xq0jMD-WM';

  const BASE_URL = getBaseURL('APP_TASK_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/api/task-attachments`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
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
  addTaskAttachmentFile: (
    taskId: string,
    body: AddTaskAttachmentFileDTO,
  ): Promise<AxiosResponse> => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    return API({ headers }).post(`/task/${taskId}/file`, body);
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
