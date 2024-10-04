export interface CreateTaskDTO {
  project: string;
  process: string;
  module: string;
  subModule?: string;
  name: string;
  team?: string[];
}

export interface EditTaskDTO {
  /**
   * Project _id
   */
  project?: string;
  /**
   * Process _id
   */
  process?: string;
  /**
   * Module _id
   */
  module?: string;
  /**
   * Sub Module _id
   */
  subModule?: string;
  /**
   * Task's name
   */
  name?: string;
  /**
   * Members assigned to the task (Member _id)
   */
  assignedTo?: string[];
  /**
   * Team initials.
   */
  team?: string[];
  duration?: number;
  startDate?: string | Date;
}

export interface EditDescriptionTaskDTO {
  /**
   * Stringified version of JSONContent from Editor
   */
  description: string;
}
