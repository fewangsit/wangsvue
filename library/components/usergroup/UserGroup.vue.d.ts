import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

/**
 * Defines valid properties in UserGroup component.
 */
export interface UserGroupProps {
  /**
   * The user objects array
   */
  users: Record<string, any>[];
  /**
   * The limit of how many users to display
   */
  limit?: number;
  /**
   * Specify the field of user to be used as display name
   *
   * @example 'name.fullName'
   *
   * @default 'nickName'
   */
  userNameField?: string;
  /**
   * Specify the field of user to be used as display picture
   *
   * @example 'image.profile'
   *
   * @default 'profilePicture'
   */
  profilePictureField?: string;
  withDialogDetail?: boolean;
  dialogHeaderLabel?: string;
}

/**
 * **WangsVue - UserGroup**
 *
 * _Displays an user and profile image._
 *
 * --- ---
 *
 * @group Component
 *
 */
declare class UserGroup extends ClassComponent<
  UserGroupProps,
  unknown,
  unknown
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    UserGroup: GlobalComponentConstructor<UserGroup>;
  }
}

export default UserGroup;
