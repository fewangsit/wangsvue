import { AxiosResponse } from 'axios';
import { User } from 'lib/types/user.type';
import { ExampleAPI as API } from '.';

export interface GetListQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetListResponseBody {
  data: User[];
  totalRecords: number;
}

export interface GetDetailResponseBody {
  data: User;
}

const ExampleService = {
  getList: (
    params?: GetListQueryParams,
  ): Promise<AxiosResponse<GetListResponseBody>> => {
    return API.get('/list', { params });
  },

  getDetail: (id: string): Promise<AxiosResponse<GetDetailResponseBody>> => {
    return API.get(`/detail/${id}`);
  },

  postCreateItem: (body: User): Promise<AxiosResponse<void>> => {
    return API.post('/create', body);
  },

  putEdit: (id: string, body: User): Promise<AxiosResponse<void>> => {
    return API.put(`/edit/${id}`, body);
  },

  deleteItem: (id: string, body: User): Promise<AxiosResponse<void>> => {
    return API.delete(`/delete/${id}`, { data: body });
  },
};

export default ExampleService;
