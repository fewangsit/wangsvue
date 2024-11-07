import { User } from 'lib/types/user.type';
import { ClassComponent } from '../ts-helpers';

export type Role = {
  _id: string;
  name: string;
  objectName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  totalMembers: number;
  modifiedBy?: User;
};

export interface RoleMemberPatch {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  isActive?: boolean;
}

export type MemberAdminRole = {
  _id: string;
  role: Pick<Role, '_id' | 'name'>;
  isActive: boolean;
};

type ModuleProgress = {
  completedModules: number;
  totalModules: number;
  percentage: number;
};

type TaskProgress = {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
};

export type ProjectLeaders = {
  _id: string;
  name: string;
  createdAt: string;
  projectManager: Pick<User, '_id' | 'nickName' | 'profilePicture'>[];
  moduleProgress: ModuleProgress;
  taskProgress: TaskProgress;
  totalTeams: number;
  totalMembers: number;
};

export interface DetailMemberProps {
  /**
   * The index of the detail shown
   */
  activeIndex: number;
  /**
   * ID of the member
   */
  memberId: string;
  /**
   * Access to member modification
   */
  access?: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

declare class DetailMember extends ClassComponent<
  DetailMemberProps,
  unknown,
  unknown
> {}

export default DetailMember;
