export interface UpdateTaskDependencyDTO {
  data: Item[];
}

interface Item {
  task: string;
  custom: boolean;
  caption?: string;
}
