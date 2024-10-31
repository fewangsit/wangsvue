import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  FetchResponse,
  QueryParams,
} from 'lib/components/datatable/DataTable.vue.d';
import {
  AssignedMember,
  AssignedMemberOptions,
} from 'lib/components/dialogdetailpbi/DialogDetailPbi.vue.d';
import { FetchOptionResponse } from 'lib/components/filtercontainer/FilterContainer.vue.d';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};
  const BASE_URL = getBaseURL('APP_PROJECT_SPRINT_API');

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

const SprintServices = {
  getPbiAssignedMembers: (
    projectId: string,
    pbiId: string,
    assign: boolean,
    query: QueryParams,
  ): Promise<AxiosResponse<FetchResponse<AssignedMember>>> => {
    return API().get(
      `/${projectId}/project-detail/sprint/product-backlog-item/${pbiId}/${assign ? 'assigned' : 'unassign'}/member`,
      {
        params: query,
      },
    );
  },

  getPbiAssignedMembersOptions: (
    projectId: string,
    pbiId: string,
    assign: boolean,
    params: AssignedMemberOptions,
  ): Promise<AxiosResponse<FetchOptionResponse<AssignedMemberOptions>>> => {
    return API({ params }).get(
      `/${projectId}/project-detail/sprint/product-backlog-item/${pbiId}/${assign ? 'assigned' : 'unassign'}/member/options`,
    );
  },

  assignPbiMembers: (
    projectId: string,
    pbiId: string,
    body: { memberIds: string[] },
  ): Promise<AxiosResponse> => {
    return API().post(
      `/${projectId}/project-detail/sprint/product-backlog-item/${pbiId}/member`,
      body,
    );
  },

  unassignPbiMember: (
    projectId: string,
    pbiId: string,
    body: { memberId: string },
  ): Promise<AxiosResponse> => {
    return API().delete(
      `/${projectId}/project-detail/sprint/product-backlog-item/${pbiId}/member`,
      {
        data: body,
      },
    );
  },

  addPbiTasks: (
    projectId: string,
    pbiId: string,
    body: { taskIds?: string[] },
  ): Promise<AxiosResponse> => {
    return API().post(
      `/${projectId}/project-detail/sprint/product-backlog-item/${pbiId}/task`,
      body,
    );
  },
};

export default SprintServices;
