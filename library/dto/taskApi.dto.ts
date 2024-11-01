export interface UpdateTaskApiDTO {
  name: string;
  method?: string;
  url?: string;
  header?: string;
  contentType?: string;
  query?: string[];
  jsonBody?: string;
  formDataBody?: FormDataBody[];
  response?: string;
}

export interface AddTaskApiDTO {
  name: string;
  task: string;
}

export interface FormDataBody {
  key: string;
  type: 'text' | 'file';
  isMandatory: boolean;
}
