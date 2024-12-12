import { DefineComponent } from 'vue';

export interface PDFViewerProps {
  /**
   * Full response from backend, file name with its folder name
   *
   * @example '/elsa/file_1733395763186.pdf'
   */
  fileName: string;
  /**
   * Add class into `iframe` element
   */
  class?: string;
  /**
   * Add style into `iframe` element
   */
  style?: string;
}

/**
 * **WangsVue - PDFViewer**
 *
 * @group components
 */
declare const PDFViewer: DefineComponent<PDFViewerProps, unknown, unknown>;

export default PDFViewer;
