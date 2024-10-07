import { Member } from './member.type';
import { Project } from './project.type';
import { ProjectModule } from './projectModule.type';
import { ProjectProcess } from './projectProcess.type';
import { ProjectSubModule } from './projectSubmodule.type';
import { WangsitStatus } from './wangsStatus.type';

export type TaskDetail = {
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
};

export type TaskDescription = {
  _id: string;
  description: string | null;
  updatedBy: Member | null;
  updatedAt: string | Date | null;
};

export type TaskDependency = {
  process: Pick<ProjectProcess, '_id' | 'name'>;
  module: Pick<ProjectModule, '_id' | 'name' | 'initial'>;
  subModule?: Pick<ProjectSubModule, '_id' | 'name'>;
  task?: TaskDependencyDetail[];
};

export type TaskDependencyDetail = {
  name: string;
  assigned: Member[];
  status: WangsitStatus;
  taskLink: string | null;
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
