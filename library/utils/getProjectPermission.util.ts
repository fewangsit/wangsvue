import isIntersect from './isIntersect';
import getUser from './getUser.util';
import { Project, Teams } from 'lib/types/project.type';
import { RoleMemberPermission } from 'lib/types/roleDetailAccess.type';

const getProjectPermission = (
  project?: Project,
  leaders?: Teams[],
): RoleMemberPermission => {
  const {
    permission: { manageProject },
  } = getUser();

  // PM have all access to project
  const pmPerm: boolean = project?.isPM ?? false;
  // Leaders have access to certain functions
  const leaderPerm: boolean = isIntersect(
    leaders ?? [],
    project?.leaders ?? [],
  );
  let key: keyof RoleMemberPermission;
  for (key in manageProject) {
    manageProject[key] = pmPerm || leaderPerm || manageProject[key];
  }

  return manageProject;
};

export default getProjectPermission;
