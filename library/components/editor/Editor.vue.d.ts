import { ClassComponent } from '../ts-helpers';

export interface EditorProps {
  /**
   * Model Value For Editor Content
   */
  modelValue?: JSONContent;
  /**
   * Model Value For Editor Content
   */
  initialValue?: JSONContent;
  /**
   * Specify the input placeholder.
   */
  placeholder?: string;
  /**
   * Determine Editor State Readonly / Editable.
   * @default 'editable'
   */
  editorState?: EditorState;
  /**
   * Change Editor Border Content.
   * @default false
   */
  borderLess?: boolean;
  /**
   * The input label. Tell the user what input is this.
   */
  label?: string;
  /**
   * Wether the input should be validated with vee-validator or not.
   * If you use this component within form input, you need to set this props as true.
   */
  useValidator?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'editorInput'
   */
  fieldName?: string;
  /**
   * Specify classes for label.
   */
  labelClass?: string;
  /**
   * Show information to user about the field.
   */
  fieldInfo?: string;
  /**
   * Classes for validator message in input field.
   */
  validatorMessageClass?: string;
  /**
   * Set custom validator message.
   * Will be show if invalid="true"
   */
  validatorMessage?: string | { empty: string };
  /**
   * Wether this input field is required or not.
   */
  mandatory?: boolean;
  /**
   * Invalid input state.
   */
  invalid?: boolean;
  /**
   * Showing Optional value text on Label.
   */
  showOptionalText?: boolean;
}

export type EditorEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [value: JSONContent];
  /**
   * Event emitted when upload image from local file
   */
  'postImageLocal': [value: PostImage];
  /**
   * Event emitted when button in floating menu named :(unset image) is clicked,
   * but this only get triger if selected image get set by postImageLocal function
   */
  'deleteImageLocal': [value: ImageProperties];
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

export type ImageProperties = {
  alt?: string;
  src: string;
  title: string;
};

export type EditorState = 'editable' | 'readonly';

declare class Editor extends ClassComponent<EditorProps, unknown, unknown> {}
