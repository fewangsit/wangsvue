import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL: 'https://sonarqube.qwertysystem.net/api',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    params,
  });

  return instance;
};

type ComponentMetricsParams = {
  name: string;
  username: string;
  password: string;
};

const SonarQubeServices = {
  getComponentMetrics: (
    payload: ComponentMetricsParams,
  ): Promise<AxiosResponse> => {
    const { name, username, password } = payload;

    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    const headers = {
      Authorization: `Basic ${encodedCredentials}`,
    };

    const params = {
      component: name,
      metricKeys:
        'coverage,bugs,vulnerabilities,security_hotspots,code_smells,duplicated_lines_density',
    };
    return API({ params, headers }).get('/measures/component');
  },
};

export default SonarQubeServices;
