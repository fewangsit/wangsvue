export type RoleMemberPermission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type RoleDetailAccess = {
  superAdmin: RoleMemberPermission;
  groupMember: RoleMemberPermission;
  manageProject: RoleMemberPermission;
  memberAdmin: RoleMemberPermission;
  point: RoleMemberPermission;
  process: RoleMemberPermission;
  role: RoleMemberPermission;
  sla: RoleMemberPermission;
  teamAndMember: RoleMemberPermission;
};
