export interface CodeSnippetProps {
  code?: string;
  /**
   * @default 'json'
   */
  lang?: 'javascript' | 'typescript' | 'html' | 'json';
  /**
   * Make the code snippets readonly
   *
   * @default false editable
   */
  readonly?: boolean;
}
