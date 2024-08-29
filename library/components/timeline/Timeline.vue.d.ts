import { ClassComponent } from '../ts-helpers';

export interface DetailValueImage {
  type: 'image';
  path?: string;
}

export type DetailValue = string | DetailValueImage;

export type TimelineItem = {
  _id: string;
  action: string;
  date: string;
  user: {
    _id: string;
    fullName: string;
    profilePicture: string;
    nickName: string;
    division: string;
    position: string;
    email: string;
  };
  detail?: Record<string, DetailValue>;
};

export type TimelineProps = {
  value: TimelineItem[];
};

/**
 * **WangsVue - Timeline**
 *
 * _Timeline visualizes a series of chained events._
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/timeline/)
 * --- ---
 *
 * @group Component
 */
declare class Timeline extends ClassComponent<
  TimelineProps,
  unknown,
  unknown
> {}

export default Timeline;
