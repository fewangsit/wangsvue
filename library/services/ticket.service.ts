import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TicketTaskIdResponse } from 'lib/types/ticket.type';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_TICKET_API');

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

const TicketServices = {
  getTicketTaskId: (
    taskId: string,
  ): Promise<AxiosResponse<TicketTaskIdResponse>> => {
    return API().get(`/ticket/task/${taskId}/dropdown`);
  },
};

export default TicketServices;
