import { Teams } from './project.type';
import { RoleDetailAccess } from './role.detail.access.type';

export type User = {
  _id: string;
  key: number;
  profilePicture?: string;
  profilePictureBig: string;
  profilePictureMedium: string;
  profilePictureSmall: string;
  fullName: string;
  nickName: string;
  email: string;
  division: string;
  position: string;
  teams: Teams[];
  permission: RoleDetailAccess;
};
