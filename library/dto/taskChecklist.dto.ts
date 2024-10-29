export interface AddTaskChecklistDTO {
  name: string;
  task: string;
  template?: string;
}

export interface UpdateTaskChecklistDTO {
  name?: string;
  caption?: string;
}

export interface AddTaskChecklistItemDTO {
  checklist: string;
  name: string;
}

export interface UpdateTaskChecklistItemDTO extends UpdateTaskChecklistDTO {
  template?: string;
}

export interface ToggleTaskChecklistItemDTO {
  checked: boolean;
  reason: string;
}

export interface AddTaskChecklistTemplateDTO {
  project: string; // Id
  checklist: string; // Id
  name: string; // Name
  module: string; // Name
  subModule: string; // Name
  task: string; // Name
  templateReplaced?: string; // Id
}
