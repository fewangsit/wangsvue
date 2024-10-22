import { EditorEvents } from '@tiptap/vue-3';
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
   * @default true
   */
  showOptionalText?: boolean;
  /**
   * Determine for image upload from local machine if value is true, no need to use postImageLocal emitter
   * @default false
   */
  isImageUploadBase64?: boolean;
  /**
   * Fetch function for mention this will get triger if putting @ in editor
   */
  fetchMentionSuggestionFunction?: () => Promise<
    GetMentionSuggestionResponse | undefined
  >;
  /**
   * Getting all mentioned list
   */
  mentionedList?: string[];
  /**
   * Add custom class tailwind for editor wrapper/container
   * and preferred for using "!" bang! for your tailwind class just to make sure it apply
   */
  editorWrapperClass?: string;
  /**
   * Add custom class tailwind for editor toolbar wrapper/container
   * and preferred for using "!" bang! for your tailwind class just to make sure it apply
   */
  toolbarWrapperClass?: string;
  /**
   * Add custom class tailwind for editor content wrapper/container
   * and preferred for using "!" bang! for your tailwind class just to make sure it apply
   */
  contentWrapperClass?: string;
}

export type EditorEmits = {
  /**
   * Event emitted when the model value is updated
   */
  'update:modelValue': [value: JSONContent];
  /**
   * Event emitted when try to upload image from local machine,
   * and need to send file image to server first using value.image params and then
   * get back image url that already get hosted.
   * to set the image url back to editor to be show up simply using value.setImageCb from params
   */
  'postImageLocal': [value: PostImage];
  /**
   * Event emitted when button in floating menu named :(unset image) is clicked,
   * but this only get triger if selected image get set by postImageLocal function
   */
  'deleteImageLocal': [value: ImageProperties];
  /**
   * Event emitted when the editor is blurred
   */
  'blur': [value: EditorEvents['blur']];
  /**
   * Event emitted when the editor is focused
   */
  'focus': [value: EditorEvents['focus']];
  /**
   * Emited Everytime mentioned user in editor change
   */
  'update:mentionedList': [value: string[]];
};

export type PostImage = {
  /**
   * This Is Image File that should be send to server
   */
  image: File;
  /**
   * Set Image Cb Is Callback For setting back image url that get send back
   *  from server through response
   */
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

export type GetMentionSuggestionResponse = {
  status: number;
  message: string;
  data: MentionSuggestion[];
};

export type MentionSuggestion = {
  _id: string;
  fullName: string;
  nickName: string;
  profilePicture: string;
};

export type EditorState = 'editable' | 'readonly';

declare class Editor extends ClassComponent<
  EditorProps,
  unknown,
  EditorEmits
> {}
