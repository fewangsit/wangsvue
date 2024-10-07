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

export interface GetCommentsResponse {
  status: number;
  message: string;
  data: CommentData[];
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
  fetchMentionSuggestionFunction?: () => Promise<
    GetMentionSuggestionResponse | undefined
  >;
}

declare class Comment extends ClassComponent<CommentProps, any, any> {}
