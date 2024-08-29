import { ClassComponent } from '../ts-helpers';

export interface AttachmentFile {
  type: 'image' | 'xls' | 'doc' | 'pdf' | 'csv' | 'video' | 'data';
  filePath?: string;
}

export interface AttachmentLink {
  type: 'link';
  url?: string;
}

export interface LinkTaskURL {
  type: 'taskUrl';
  url: string;
}

export interface LinkTaskIframeEmbed {
  type: 'embed';
  code: string;
}

export interface DetailText {
  type: 'text';
  value: string;
}

export type Attachment =
  | AttachmentLink
  | AttachmentFile
  | LinkTaskIframeEmbed
  | LinkTaskURL;

export type LinkTaskEditAction = Record<
  'Sebelum' | 'Sesudah',
  LinkTaskURL | LinkTaskIframeEmbed
>;

export type KeyValue = Record<string, string>;

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
  detail?: KeyValue | Attachment | LinkTaskEditAction | DetailText;
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
