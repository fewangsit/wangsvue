import { FetchResponse } from 'lib/components/datatable/DataTable.vue.d';

export interface MemberListResponse extends FetchResponse {
  status: number;
  message: string;
  data: MemberData;
}

interface MemberData {
  totalRecords: number;
  data: Member[];
}

export interface Member {
  _id: string;
  isActive: boolean;
  profilePictureBig: string;
  profilePictureMedium: string;
  profilePictureSmall: string;
  fullName: string;
  nickName: string;
  finishedDate: string;
  employeeType: string;
  division: string;
  position: string;
  teams: string[];
  email: string;
  phoneNumber: string;
  initial: string;
  groupMember: GroupMember;
  needLeaderReview: boolean;
  needTestingAccount: boolean;
  lastLogin: string;
  lastLoginIp: string;
  groupMemberAssignedBy: AssignedBy;
  groupMemberAssignedAt: string;
  permission: Permission;
  hasAdminRoles: boolean;
  projectCount: number;
  isTeamLeader: boolean;
  isSubModuleLeader: boolean;
  isAssignedToTask: boolean;
  isProjectManager: boolean;
  isActivate: boolean;
}

interface GroupMember {
  name: string;
  targetType: string;
  _id: string;
}

interface AssignedBy {
  fullName: string;
  nickName: string;
  key: number;
  profilePictureBig: string;
  profilePictureMedium: string;
  profilePictureSmall: string;
  _id: string;
}

interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
