import { TaskLinkType, TaskLinkURLType } from 'lib/types/task.type';

export interface CreateTaskDTO {
  project: string;
  process: string;
  module: string;
  subModule?: string;
  repository?: string;
  name: string;
  team?: string[];
  assignedTo?: string[];
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

export interface EditTaskLinkDTO {
  /**
   * The link, also the field to be used for embed.
   */
  link: string;
  linkType: TaskLinkURLType;
  type: TaskLinkType;
}
