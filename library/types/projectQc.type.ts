export type ExecuteEndpointResponse = {
  status: number;
  message: string;
  data: ExecuteEndpoint;
};

export type ExecuteEndpoint = {
  pingServerMs: number;
  responseTimeMs: number;
  statusString: string;
  response: any;
};

export interface EndpointDetailResponse {
  data: EndpointDetail;
  status: number;
  message: string;
}

export interface EndpointDetail {
  _id: string;
  module: {
    _id: string;
    name: string;
  };
  subModule: {
    _id: string;
    name: string;
  };
  api: string;
  type: 'json' | 'form-data';
  endpoint: {
    method: string;
    url: string;
  };
  pathVariables: string[];
  query: string[];

  jsonBody: string;

  formDataBody: FormDataBody[];
  savedBody: Record<string, unknown>;

  savedPathVariables: Record<string, unknown>;
  savedQueryParams: Record<string, string>;

  apiSpecResponse: string;
}

export interface FormDataBody {
  _id: string;
  key: string;
  type: 'text' | 'file';
  isMandatory: boolean;
}

// Both is Stringified object containing "key" and "value"
export interface ExecuteEndpointQueryParams {
  pathVariables: Record<string, unknown>[];
  queryParams: Record<string, unknown>[];
}

export type ExecuteEndpointBody = string | FormData;
