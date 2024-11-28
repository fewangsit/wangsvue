import { DevelopmentStatus, ProjectStatus } from 'lib/types/wangsStatus.type';
import { ImageCompressorPayload } from '../imagecompressor/ImageCompressor.vue.d';
import { ClassComponent } from '../ts-helpers.d';

export interface Summary {
  name: string;
  priority: number;
  status: ProjectStatus;
  initialName: string;
  /**
   * Task with status 'Sprint'
   */
  totalSprintTask: number;
  /**
   * Task with status 'Selesai'
   */
  totalCompletedTask: number;
  /**
   * Task with status 'Backlog'
   */
  totalBacklogTask: number;
  /**
   * The maximum points that can be reached for the project (calculated as the sum of the maximum points for all Sprint tasks).
   */
  totalSprintPoint: number;
  /**
   * How many Report Bug actions happened
   */
  totalBugHistories: number;
}

export interface ProjectSummary extends Summary {
  type: 'project';
  totalModule: number;
  totalCompletedModule: number;
}

export interface ModuleSummary extends Summary {
  type: 'module';
  totalSubModule: number;
}

export interface SubModuleSummary extends Omit<Summary, 'initialName'> {
  type: 'submodule';
  moduleName: string;
  progressWeb?: number;
  progressMobile?: number;
  statusWeb?: DevelopmentStatus;
  statusMobile?: DevelopmentStatus;
}

export interface UserProfileSummary
  extends Omit<Summary, 'name' | 'initialName' | 'priority' | 'status'> {
  type: 'profile';
  nickName: string;
  fullName: string;
  initial: string;
  aliasName?: string;
  division: string;
  position: string;
  isActive: boolean;
  profilePicture?: string;
  email: string;
  phoneNumber: string;
  teams: string[];
  sprintPoint: number;
  totalSprintTaskDuration: number;
  completeProfile?: boolean;
  editable?: boolean;
  editedEmail?: string;
  useInitial?: boolean;
}

export interface SummaryAccordionProps {
  summary?:
    | ProjectSummary
    | ModuleSummary
    | SubModuleSummary
    | UserProfileSummary;
  /**
   * Specify the field name for the image compressor.
   *
   * @default 'imageInput'
   */
  fieldName?: string;
}

export type SummaryAccordionEmits = {
  edit: [];
  cancelEditEmail: [];
  /**
   * On apply the image cropper.
   */
  apply: [value: ImageCompressorPayload];
  /**
   * On apply image from props.
   */
  applyProp: [];
  /**
   * On delete button clicked.
   *
   * When props.confirmOnDelete is true, on dialog confirmed, this emit will be emitted with a delete function.
   * You need to call the function inside your own delete funcition to clear the image.
   *
   * @param deleteFn - the function delete
   * @param index - the index of image to be deleted
   */
  delete: [deleteFn?: (index?: number) => void, index?: number];
};

export default class SummaryAccordion extends ClassComponent<
  SummaryAccordionProps,
  unknown,
  SummaryAccordionEmits
> {
  /**
   * Exposed function to assign image from props.
   *
   * @param isDelete
   */
  assignPreviewImagesFromProp(isDelete?: boolean): Promise<void>;
}
