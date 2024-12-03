interface GroupMember {
  _id: string;
  name: string;
  key: number;
  targetType: string;
}

interface AdminRole {
  _id: string;
  key: number;
  name: string;
}

interface TaskProgress {
  total: number;
  finished: number;
  ratio: number;
}

interface Permission {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
}

export interface Member {
  _id: string;
  isActive: boolean;
  isActivate: boolean;
  fullName: string;
  nickName: string;
  key: number;
  profilePictureBig?: string | null;
  profilePictureMedium?: string | null;
  profilePictureSmall?: string | null;
  employeeType: string;
  finishedDate?: string;
  division: string;
  position: string;
  teams: string[];
  email: string;
  phoneNumber: string;
  initial: string;
  groupMember: GroupMember;
  adminRole: AdminRole[];
  needLeaderReview: boolean;
  needTestingAccount: boolean;
  projectCount: number;
  taskProgress: TaskProgress;
  lastLogin?: string;
  lastLoginIp?: string;
  figmaPassword?: string;
  githubPassword?: string;
  isTeamLeader: boolean;
  isSubModuleLeader: boolean;
  isAssignedToTask: boolean;
  isProjectManager: boolean;
  permission: Permission;
}

export type MemberDetail = Member & {
  groupMemberAssignedBy: Pick<
    Member,
    | '_id'
    | 'key'
    | 'fullName'
    | 'nickName'
    | 'profilePictureBig'
    | 'profilePictureMedium'
    | 'profilePictureSmall'
  >;
  groupMemberAssignedAt: string;
  pointProgress: {
    sprintPoint: number;
    totalSprintPoint: number;
  };
  taskProgress: {
    totalBacklogTask: number;
    totalSprintTask: number;
    totalCompletedTask: number;
  };
  totalSprintTaskDuration: number;
  totalBugHistories: number;
};
