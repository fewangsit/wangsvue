import { FormDataBody } from 'lib/dto/taskApi.dto';
import { Member } from './member.type';
import { DropdownOption } from './options.type';
import { Project } from './project.type';
import { ProjectModule } from './projectModule.type';
import { ProjectProcess } from './projectProcess.type';
import { ProjectSubModule } from './projectSubmodule.type';
import { WangsitStatus } from './wangsStatus.type';
import { JSONContent } from 'lib/components/editor/Editor.vue.d';
import { ChildGroup } from 'lib/components/datatable/DataTable.vue.d';

export type TaskDetailData = {
  _id: string;
  project: Project;
  process: ProjectProcess;
  module: ProjectModule;
  subModule: ProjectSubModule;
  name: string;
  assignedTo: Member[];
  team: string[]; // Team Initial
  status: WangsitStatus;
  priority: number | null;
  timeReportedBug: number;
  startDate: Date | null;
  finishedDate: Date | null;
  duration: number | null;
  timerStartedAt: string | null;
  timerStartedValue: number | null;
};

export type TaskDescription = {
  _id: string;
  description: string | null;
  updatedBy: Member | null;
  updatedAt: string | Date | null;
};

export type TaskDependency = {
  process?: Pick<ProjectProcess, '_id' | 'name'>;
  module?: Pick<ProjectModule, '_id' | 'name' | 'initial'>;
  subModule?: Pick<ProjectSubModule, '_id' | 'name'>;
  task?: TaskDependencyDetail[];
  options?: DropdownOption[];
  selectedOptions?: string[];
  loading?: boolean;
  custom?: boolean;
  processOptions?: DropdownOption[];
  moduleOptions?: DropdownOption[];
  subModuleOptions?: DropdownOption[];
  subModuleVisibility?: boolean;
};

export type TaskDependencyDetail = {
  _id: string;
  name: string;
  assignedTo: Member[];
  status: WangsitStatus;
  taskLink: TaskLink;
  caption: string;
  showCaption?: boolean;
};

export type TaskLinkType = 'task' | 'service';
export type TaskLinkURLType = 'url' | 'embedded';

export type TaskLink = {
  _id: string;
  type: TaskLinkType;
  link: string;
  linkType: TaskLinkURLType;
  updatedBy: Member;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type TaskChecklist = {
  _id: string;
  name: string;
  task: string;
  caption?: string;
  checklistItems?: TaskChecklistItem[];
  showRenameChecklist?: boolean;
  showAddItem?: boolean;
};

export type TaskChecklistItem = {
  _id: string;
  name: string;
  checked: boolean;
  updatedBy?: {
    _id: string;
    fullName: string;
    nickName: string;
  };
  isRequested: boolean;
  checkedAt?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
  attachments: any[];
  showRenameItem?: boolean;
  showCaptionItem?: boolean;
  content?: JSONContent;
  key?: number;
};

export type TaskChecklistTemplate = {
  _id: string;
  project: string;
  name: string;
  module: string;
  subModule: string;
  task: string;
  items: string[];
  createdBy: Member;
  createdAt: string;
  updatedAt: string;
};

export interface TaskAPI {
  _id: string;
  name: string;
  header?: string;
  url?: string;
  method?: string;
  query?: string[];
  contentType: string;
  jsonBody?: string;
  formDataBody?: FormDataBody[];
  response?: string;
  isIntact?: boolean;
  isSuccess?: boolean;
  updatedBy: Member;
  updatedAt: string;
  anyChanges?: boolean; // Custom field for indicator if there is any changes in the data
}

export type FormDataBodyCustom = Omit<FormDataBody, 'isMandatory'> & {
  isMandatory: 'ya' | 'tidak';
};

export type TaskAPIFormDataCustom = Omit<TaskAPI, 'formDataBody'> & {
  formDataBody: FormDataBodyCustom[];
};

export interface TaskReview {
  _id: string;
  task: string;
  user: Member;
  title: string;
  content?: string;
  checklists?: TaskReviewChecklist[];
  createdAt: string;
  updatedAt: string;
}

interface TaskReviewChecklist {
  name: string;
  items: TaskReviewChecklistItem[];
}

interface TaskReviewChecklistItem {
  name: string;
  result: 'Ok' | 'Bug';
  content?: string;
}

export interface TaskTableItem {
  _id: string;
  project: Project;
  process: ProjectProcess;
  module: ProjectModule;
  subModule: ProjectSubModule;
  name: string;
  assignedTo: Member[];
  team: string[];
  status: string;
  priority?: number;
  timeReportedBug: number;
  childTask: number;
  dependency: TaskTableItemDependency;
  lastUpdatedAt: string;
  children?: ChildGroup[];
  hasChildren?: boolean;
}

export interface TaskTableItemDependency {
  done: number;
  onProgress: number;
}

export interface TaskTableOptionQuery {
  projectOptions?: boolean;
  moduleOptions?: boolean;
  subModuleOptions?: boolean;
  memberOptions?: boolean;
  taskOptions?: boolean;
  processOptions?: boolean;
}

export interface TaskTableFamily {
  dependencies: TaskTableItem[];
  children: TaskTableItem[];
}

export interface TaskTableFamilyResponse {
  status: number;
  message: string;
  data: TaskTableFamily;
}
