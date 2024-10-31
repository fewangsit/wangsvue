import { JSONContent } from '@tiptap/vue-3';
import { ClassComponent } from '../ts-helpers';
import { QueryParams } from '../datatable/DataTable.vue.d';
import { GetMentionSuggestionResponse } from '../editor/Editor.vue.d';

export interface CommentProps {
  /**
   * Current Login User Account.
   */
  user: User;
  /**
   * Unique Id from detail page
   */
  objectId: string;
  /**
   * Type Of Comment where you use it
   */
  commentType: CommentType;
  /**
   * To determine all of comments position based on input field
   *
   * @default below
   */
  commentPosition?: 'above' | 'below';
  /**
   * To determine whether using reactions or not
   * @default true
   */
  useReactions?: boolean;
  /**
   * To determine whether using replies or not
   * @default true
   */
  useReplies?: boolean;
  /**
   * To determine whether each comment should display time stamp or not
   * @default true
   */
  useTimeStamp?: boolean;
  /**
   * To determine whether component comment should use external services or not
   * @default false
   */
  useExternalServices?: boolean;
  /**
   * To pass comments data from external services
   */
  data?: GetCommentsResponse;
}

export interface PostCommentsBody {
  objectId: string;
  replyToId?: string;
  mentions?: string[];
  type: CommentType;
  content: JSONContent | object;
}

export interface PostCommentsReactionBody {
  emoji: string;
}

export interface PostCommentsUploadBody {
  images: File[];
}

export interface GetCommentsResponse<T = CommentData> {
  status: number;
  message: string;
  data: T[];
}

export type CommentType = 'ticket' | 'task' | 'module' | 'sub-module';

export interface Reaction {
  count: number;
  emoji: string;
  users: User[];
}

export interface User {
  _id: string;
  fullName: string;
  profilePicture: string;
}

export interface CommentData {
  _id: string;
  replyToId: string;
  type: CommentType;
  objectId: string;
  sender: Sender;
  reactions: Reaction[];
  replies: CommentData[];
  content: JSONContent;
  createdAt: string;
  editedAt?: string | null;
}

export interface PostCommentsUploadResponse {
  status: number;
  message: string;
  data: string[];
}

export interface PutCommentsByIdBody {
  content: JSONContent;
}

export interface Sender {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface NewCommentResponse extends CommentData {
  replyToId: string;
}

export interface UpdatedCommentReponse {
  _id: string;
  content: JSONContent;
}

export interface PostCommentsReactionsByCommentIdBody {
  emoji: string;
}

export interface CommentsMentionQueryParams extends QueryParams {
  objectID: string;
  type: CommentType;
  search?: string;
}

export interface CommentsReactionResponse {
  _id: string;
  reactions: Reaction[];
}

export interface CommentBlockProps extends CommentData {
  commentType: CommentType;
  user: User;
  /**
   * To determine whether using reactions or not
   * @default true
   */
  useReactions?: boolean;
  /**
   * To determine whether using replies or not
   * @default true
   */
  useReplies?: boolean;
  /**
   * To determine whether each comment should display time stamp or not
   * @default true
   */
  useTimeStamp?: boolean;
  fetchMentionSuggestionFunction?: () => Promise<
    GetMentionSuggestionResponse | undefined
  >;
}

declare class Comment extends ClassComponent<CommentProps, any, any> {}
