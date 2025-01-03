import { ClassComponent } from '../ts-helpers.d';

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
  disabled?: boolean;
}

/**
 * Attachment item component emits
 */
export type AttachmentItemEmits = {
  updateCaption: [];
  deleted: [];
  clickItem: [item: AttachmentItemData];
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
  unknown,
  AttachmentItemEmits
> {}

export default AttachmentItem;
