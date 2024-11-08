import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  FetchResponse,
  QueryParams,
} from 'lib/components/datatable/DataTable.vue.d';
import { MemberAdminRole } from 'lib/components/detailmember/DetailMember.vue.d';
import { FetchOptionResponse } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_SETTINGS_MEMBER_ADMIN_API');

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

const MemberAdminServices = {
  getMemberRoles: (
    memberAdminId: string,
    params: QueryParams,
  ): Promise<AxiosResponse<FetchResponse<MemberAdminRole>>> => {
    return API({ params }).get(`/member-admin/${memberAdminId}/roles`);
  },

  getMemberRolesOptions: (
    memberAdminId: string,
  ): Promise<AxiosResponse<FetchOptionResponse<{ roles: true }>>> => {
    return API({ params: { roles: true } }).get(
      `/member-admin/${memberAdminId}/roles/options`,
    );
  },

  activateRoles: (
    memberAdminId: string,
    body: {
      roleIds: string[];
      isActive: boolean;
    },
  ): Promise<AxiosResponse> => {
    return API().post(`/member-admin/${memberAdminId}/bulk-activation`, body);
  },

  updateMemberAdmin: (
    memberAdminId: string,
    body: {
      roleId: string[];
    },
  ): Promise<AxiosResponse> => {
    return API().put(`/member-admin/${memberAdminId}`, body);
  },
};

export default MemberAdminServices;
