import {
  ClassComponent,
  GlobalComponentConstructor,
} from 'lib/components/ts-helpers';

export interface ButtonDownloadProps {
  fileName: string;
  /**
   * Specify which table to be exported.
   * When it is not specified, the default name of data table will be used.
   *
   * @default 'datatable'
   */
  tableName?: string;
  /**
   * If you want to download multiple table in 1 excel
   */
  multiTableNames?: string[];
}

/**
 * **WangsVue - ButtonDownload**
 *
 * _Trigger DataTable Export Excel_
 *
 * [Live Demo](https://fewangsit.github.io/wangsvue/button)
 * --- ---
 * ![WangsVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group Component
 */
declare class ButtonDownload extends ClassComponent<
  ButtonDownloadProps,
  Record<string, unknown>,
  Record<string, unknown>
> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ButtonDownload: GlobalComponentConstructor<ButtonDownload>;
  }
}

export default ButtonDownload;
