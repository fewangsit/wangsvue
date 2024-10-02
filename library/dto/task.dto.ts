export interface CreateTaskDTO {
  project: string;
  process: string;
  module: string;
  subModule?: string;
  name: string;
  team?: string[];
}
