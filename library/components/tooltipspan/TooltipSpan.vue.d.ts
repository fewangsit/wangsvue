import { DefineComponent } from 'vue';

export type TooltipSpanProps = {
  /**
   * The full text to be displayed on the tooltip.
   * The tooltip will only be shown if the text is truncated.
   * @default ''
   */
  fullText?: string;
  /**
   * The maximum length of the text displayed on the span. If the text is longer
   * than this value, it will be truncated and an ellipsis (...) will be added.
   * @default 36
   */
  length?: number;
};

declare const TooltipSpan: DefineComponent<TooltipSpanProps>;

export default TooltipSpan;
