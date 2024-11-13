import { ClassComponent } from 'lib/components/ts-helpers';

export type FileType =
  | 'link'
  | 'image'
  | 'txt'
  | 'doc'
  | 'xls'
  | 'pdf'
  | 'csv'
  | 'html'
  | 'json'
  | 'mp4'
  | 'mkv'
  | 'compressed'
  | 'unknown';

export interface AttachmentItemData {
  displayName?: string;
  url?: string;
  type?: FileType;
  caption?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: { fullName: string; nickName: string; _id: string };
  _id: string;
}

/**
 * Attachment item component props
 */
export interface AttachmentItemProps {
  type: 'attachment' | 'checklist';
  item?: AttachmentItemData;
  readonly?: boolean;
}

/**
 * Attachment item component emits
 */
export type AttachmentItemEmits = {
  updateCaption: [];
  deleted: [];
};

/**
 * **WangsVue - AttachmentItem**
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group Component
 *
 * @experimental
 */
declare class AttachmentItem extends ClassComponent<
  AttachmentItemProps,
  AttachmentItemEmits,
  unknown
> {}

export default AttachmentItem;
