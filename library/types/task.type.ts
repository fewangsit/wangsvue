import { Member } from './member.type';
import { Project } from './project.type';
import { ProjectModule } from './projectModule.type';
import { ProjectProcess } from './projectProcess.type';
import { ProjectSubModule } from './projectSubmodule.type';
import { WangsitStatus } from './wangsStatus.type';

// TODO: Replace with response API
export type TaskDependency = {
  process: ProjectProcess;
  module: ProjectModule;
  subModule?: ProjectSubModule;
  tasks?: TaskDetail[];
};

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
