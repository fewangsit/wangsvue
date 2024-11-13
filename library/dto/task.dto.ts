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
  priority?: number;
}

export interface UpdateTaskMemberDTO {
  data: UpdateTaskMemberItem[];
}

export interface UpdateTaskMemberItem {
  task: string;
  member: string;
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

export interface ReviewTaskDTO {
  data: ReviewTaskData[];
  checklists: ReviewTaskChecklist[];
}

export interface ReviewTaskData {
  checklistId: string;
  checklistName: string;
  checklistItemName: string;
  result: 'Ok' | 'Bug';
  content?: string;
}

export interface ReviewTaskChecklist {
  checklistName: string;
  checklistItems: ChecklistItem[];
}

export interface ChecklistItem {
  checklistItemName: string;
  content?: string;
}
