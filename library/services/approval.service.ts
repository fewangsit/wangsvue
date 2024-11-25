import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};
  const BASE_URL = getBaseURL('APP_PROJECT_APPROVAL_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${user.jwt}`,
      ...headers,
    },
    params,
  });

  return instance;
};

const ApprovalServices = {
  createApproval: (
    projectId: string,
    sprintId?: string,
  ): Promise<AxiosResponse> => {
    return API().post('/api/approval/sprint', {
      project: projectId,
      sprint: sprintId,
    });
  },
};

export default ApprovalServices;
