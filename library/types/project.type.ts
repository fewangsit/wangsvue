export type Teams = 'BE' | 'FE' | 'MOB' | 'IOT' | 'DEV' | 'QC' | 'UIUX' | 'TW';

export type Project = {
  _id: string;
  name: string;
  initialName: string;
  priority: number;
  status: string;
  totalModule: number;
  totalCompletedModule: number;
  totalSprintTask: number;
  totalCompletedTask: number;
  totalSprintPoint: number;
  totalBacklogTask: number;
  totalBugHistories: number;
  type: string;
  method: string;
  startAt: string;
  createdAt: string;
  templateProcess: {
    _id: string;
    name: string;
  };
  managers: {
    id: string;
    name: string;
  }[];
  leaders: Teams[];
  members: Teams[];
  isPM: boolean;
  isApprover: boolean;
};
