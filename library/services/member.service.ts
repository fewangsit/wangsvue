import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { MemberListResponse } from 'lib/dto/member.dto';
import { queryParamsStringfy } from 'lib/utils/queryParamsStringfy.util';

export interface Member {
  _id: string;
  profilePicture?: string;
  profilePictureBig?: string;
  fullName: string;
  nickName: string;
  division: string;
  position: string;
  teams: string[];
  email: string;
  initial: string;
}

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const BASE_URL = import.meta.env.VITE_APP_TEAM_MEMBER_MEMBER_API;
  const { jwt } = JSON.parse(localStorage.user ?? '{}');

  return axios.create({
    baseURL: `${BASE_URL}/api/members`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
      ...headers,
    },
    params,
  });
};

const MemberServices = {
  getMemberDetail: (
    memberId: string,
  ): Promise<AxiosResponse<AxiosResponse<Member>>> => {
    return API().get(`/${memberId}`);
  },

  getMemberList: (params?: {
    team: string[];
  }): Promise<AxiosResponse<MemberListResponse>> => {
    return API({ params: queryParamsStringfy(params) }).get('');
  },
};

export default MemberServices;
