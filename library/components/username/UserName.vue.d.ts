import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

/**
 * Defines valid properties in UserName component.
 */
export interface UserNameProps {
  /**
   * The thumbnail UserName.
   */
  thumbnail?: string | Blob;
  /**
   * The path to full size UserName for UserName preview.
   * @defaultValue thumbnail
   */
  preview?: string;
  /**
   * The full user Object
   */
  user?: Record<string, any>;
  /**
   * Specify the field of user to be used as display name
   *
   * @example 'name.fullName'
   *
   * @default 'nickName'
   */
  userNameField?: string;
  /**
   * Specify the field of user to be used as display name
   *
   * @example 'image.profile'
   *
   * @default 'profile'
   */
  userProfileField?: string;
}

/**
 * **WangsVue - UserName**
 *
 * _Displays an user and profile image._
 *
 * --- ---
 *
 * @group Component
 *
 */
declare class UserName extends ClassComponent<
  UserNameProps,
  unknown,
  unknown
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    UserName: GlobalComponentConstructor<UserName>;
  }
}

export default UserName;
