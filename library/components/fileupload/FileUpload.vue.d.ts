import { ClassComponent, GlobalComponentConstructor } from '../ts-helpers';

export type InputErrorCodes = 'FILE_SIZE_TOO_LARGE';

/**
 * Defines valid properties in FileUpload component.
 */
export type FileUploadProps = {
  /**
   * Pattern to restrict the allowed file types such as 'image/*'.
   */
  accept?: string | undefined;
  /**
   * Disables the upload functionality.
   * @defaultValue false
   */
  disabled?: boolean | undefined;
  /**
   * Maximum file size allowed in bytes.
   */
  maxFileSize?: number | undefined;
  /**
   * Message of the invalid fize size.
   * - Use {0} to get the file's name
   * - Use {1} to get the max file size
   * - Use {2} to get the accepted file types from props.accept
   * - Use {2.1} to get the accepted file types from props.fileExtensions
   * @defaultValue {0}: Invalid file size, file size should be smaller than {1}.
   */
  invalidFileSizeMessage?: string | undefined;
  /**
   * Message of the invalid fize type.
   * - Use {0} to get the file's name
   * - Use {1} to get the max file size
   * - Use {2} to get the accepted file types
   * - Use {2.1} to get the accepted file types from props.fileExtensions
   * @defaultValue '{0}: Invalid file type, allowed file types: {2}'
   */
  invalidFileTypeMessage?: string | undefined;
  /**
   * Label of the file upload.
   * @defaultValue 'Upload File'
   */
  label?: string | undefined;
  /**
   * Whether to use an upload button.
   * @defaultValue true
   */
  withUpload?: boolean | undefined;
  /**
   * Label of the upload button.
   * @defaultValue 'Upload'.
   */
  uploadLabel?: string | undefined;
  /**
   * Placeholder of the file upload.
   * @defaultValue 'Select File'
   */
  placeholder?: string | undefined;
  /**
   * File extensions to display the accepted extensions.
   */
  fileExtensions?: string | undefined;
  /**
   * The note about the requirements of file for being uploaded.
   *
   * Placed at the bottom right of input.
   */
  fileRequirements?: string | undefined;
  /**
   * The function to be called after the upload button is clicked. (Must be used when withUpload is true)
   */
  uploadFunction?: (files: File[]) => Promise<void>;
  /**
   * Whether the input should be validated with vee-validator or not.
   * If you use this component within form input, you need to set this props as true.
   */
  useValidator?: boolean;
  /**
   * This prop is required if you use this component in a form input.
   * Specify the unique field name, match with your needs for API request.
   *
   * @default 'fileUpload'
   */
  fieldName?: string;
  /**
   * Whether this input field is required or not.
   */
  mandatory?: boolean;
  /**
   * Wether show toast error message on invalid file input
   *
   * @default true;
   */
  useErrorToast?: boolean;
};

export type FileUploadEmits = {
  /**
   * Callback to invoke when file upload is complete.
   */
  upload: [event: FileUploadUploadEvent];
  /**
   * Callback to invoke if file upload fails.
   */
  error: [event: FileUploadErrorEvent | InputErrorCodes];
};

/**
 * **WangsVue - FileUpload**
 *
 * _FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations._
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/button)
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 *
 */
declare class FileUpload extends ClassComponent<
  FileUploadProps,
  null,
  FileUploadEmits
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    FileUpload: GlobalComponentConstructor<FileUpload>;
  }
}

export default FileUpload;
