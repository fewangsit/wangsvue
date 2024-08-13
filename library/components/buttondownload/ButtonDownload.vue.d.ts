import { DefineComponent } from 'vue';

export interface ButtonDownloadProps {
  fileName: string;
  /**
   * Specify which table to be exported.
   * When it is not specified, the default name of data table will be used.
   *
   * @default 'datatable'
   */
  tableName?: string;
}

declare const ButtonDownload: DefineComponent<ButtonDownloadProps>;

export default ButtonDownload;
