import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getBaseURL } from 'lib/utils/getBaseURL.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_PROJECT_TEAM_API');

  const instance = axios.create({
    baseURL: `${BASE_URL}/projects`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

const ProjectTeamServices = {
  getProjectTeamMembers: (
    projectId: string,
    teamInitial: string,
  ): Promise<AxiosResponse> => {
    const params = {
      initial: JSON.stringify([teamInitial]),
    };
    return API({ params }).get(`/${projectId}/members`);
  },
};

export default ProjectTeamServices;
