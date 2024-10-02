import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  // TODO: Remove this on production.
  user.jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE3NzFjMWViZTUzNDRiYzJiOWRhYiIsImlhdCI6MTcyNjU0MjI3Nn0.euXnP_TUc5kv2236kGv2zsFvwgp6ZlT8QCdY8nUaypk';

  const BASE_URL = getBaseURL('APP_TEAM_MEMBER_MEMBER_API');

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

const MemberServices = {
  getMemberList: (params?: Record<string, string>): Promise<AxiosResponse> => {
    return API({ params }).get('/api/members');
  },
};

export default MemberServices;
