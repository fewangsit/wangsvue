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

export type ProjectDetail = {
  _id: string;
  type: string;
  name: string;
  initialName: string;
  method: string;
  priority?: number;
  startAt: string;
  isApprover: boolean;
  leaders: string[];
  members: string[];
  isPM: boolean;
  totalModule: number;
  totalCompletedModule: number;
  totalSprintTask: number;
  totalCompletedTask: number;
  totalBacklogTask: number;
  totalBugHistories: number;
  totalSprintPoint: number;
  status: string;
  managers: Manager[];
  templateProcess: TemplateProcess;
  createdAt: string;
};

interface TemplateProcess {
  _id: string;
  name: string;
}

interface Manager {
  id: string;
  name: string;
}
