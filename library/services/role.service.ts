import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';
import { Role } from 'lib/components/detailmember/DetailMember.vue.d';
import { QueryParams } from 'lib/components/datatable/DataTable.vue.d';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};
  const BASE_URL = getBaseURL('APP_SETTINGS_ROLE_API');

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

const RoleServices = {
  getRoles: (
    query: QueryParams,
  ): Promise<AxiosResponse<AxiosResponse<Role[]>>> => {
    return API().get('/roles', { params: query });
  },
};

export default RoleServices;
