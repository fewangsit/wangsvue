export interface CreateTaskDTO {
  project: string;
  process: string;
  module?: string;
  subModule?: string;
  name: string;
  assignedTo?: string[]; // Array of member _id
  team?: string;
}
