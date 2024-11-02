import { ProjectModule } from './projectModule.type';
import { ProjectSubModule } from './projectSubmodule.type';
import { Team } from './team.type';

export type ProjectProcess = {
  _id: string;
  name: string;
  processPosition: string;
  reviewLeader: boolean;
  active: boolean;
  default: boolean;
  team: Team[];
  dependencies: ProjectModule[] | ProjectSubModule[];
  parentOf: ProjectModule[] | ProjectSubModule[];
  totalTasks: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};
