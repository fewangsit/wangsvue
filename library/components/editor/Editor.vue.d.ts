import { ClassComponent } from '../ts-helpers';

export interface EditorProps {
  /**
   * Model Value For Editor Content
   */
  modelValue: JSONContent;
}

export type EditorEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [value: JSONContent];
  /**
   * Event emitted when the upload image from local file
   */
  'postImageLocal': [value: PostImage];
};

export type PostImage = {
  image: File;
  setImageCb: (imageUrl: string) => void;
};

/**
 * Editor Content Meta Data
 */
export type JSONContent = {
  type?: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, any>;
    [key: string]: any;
  }[];
  text?: string;
  [key: string]: any;
};

declare class Dropdown extends ClassComponent<EditorProps, unknown, unknown> {}
