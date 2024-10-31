import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

/**
 * Defines valid properties in UserName component.
 */
export interface UserNameProps {
  /**
   * @default 'picture' - Show user profile picture instead of user icon
   */
  type?: 'icon' | 'picture';
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
   * Specify the field of user to be used as display picture
   *
   * @example 'image.profile'
   *
   * @default 'profilePicture'
   */
  profilePictureField?: string;
  /**
   * TODO: Implement emptyable username
   * Specify if the component can be emptyable
   *
   * @default false
   */
  emptyable?: boolean;
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
