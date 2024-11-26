import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  EndpointDetailResponse,
  ExecuteEndpointBody,
  ExecuteEndpointQueryParams,
  ExecuteEndpointResponse,
} from 'lib/types/projectQc.type';
import { getBaseURL } from 'lib/utils/getBaseURL.util';
import { queryParamsStringfy } from 'lib/utils/queryParamsStringfy.util';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

  const BASE_URL = getBaseURL('APP_PROJECT_QC_API');

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

const ProjectQCServices = {
  getEndpointDetail: (
    projectId: string,
    endpointId: string,
  ): Promise<AxiosResponse<EndpointDetailResponse>> => {
    return API().get(
      `/performance-testing/${projectId}/endpoints/${endpointId}`,
    );
  },

  postExecuteEndpoint: (
    projectId: string,
    endpointId: string,
    type: 'json' | 'form-data',
    params: ExecuteEndpointQueryParams,
    body: ExecuteEndpointBody,
  ): Promise<AxiosResponse<ExecuteEndpointResponse>> => {
    return API({
      headers: {
        'content-type':
          type === 'form-data' ? 'multipart/form-data' : ' application/json',
      },
      params: queryParamsStringfy(params),
    }).post(
      `/performance-testing/${projectId}/endpoints/${endpointId}/execute`,
      body,
    );
  },
};

export default ProjectQCServices;
