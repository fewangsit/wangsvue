import getUser from './getUser.util';

const getUserType = (): string[] => {
  {
    const user = getUser();
    const returnArray: string[] = [];
    const isAdmin = Object.values(user?.permission?.manageProject || {}).every(
      (value) => value === true,
    );

    if (isAdmin) returnArray.push('admin');
    if (user?.isProjectManager) returnArray.push('pm');
    if (user?.isTeamLeader) returnArray.push('teamLeader');
    return [...returnArray, 'guest'];
  }
};

export default getUserType;
