import axios, { AxiosResponse, AxiosInstance } from 'axios';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const BASE_URL = import.meta.env.VITE_APP_SALES_API;
  const { token } = JSON.parse(localStorage.user ?? '{}');

  return axios.create({
    baseURL: `${BASE_URL}/v1/data-manager/files`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...headers,
    },
    params,
  });
};

const DataManagerServices = {
  getFile: (fileName?: string): Promise<AxiosResponse> => {
    return API().get(`${fileName}`, { responseType: 'blob' });
  },
};

export default DataManagerServices;
