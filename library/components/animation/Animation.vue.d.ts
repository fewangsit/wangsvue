import { ClassComponent } from '../ts-helpers.d';

export interface AnimationProps {
  animation: 'no-data' | 'loading-plane' | 'loading-table';
}

/**
 * **WangsVue - Animation**
 *
 * _Animation is a lottie animation wrapper._
 *
 * @group Component
 */
declare class Animation extends ClassComponent<
  AnimationProps,
  unknown,
  unknown
> {}

export default Animation;
