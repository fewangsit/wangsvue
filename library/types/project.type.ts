export type Project = {
  _id: string;
  initial: string;
  name: string;
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
