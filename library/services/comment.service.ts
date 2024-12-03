import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  PostCommentsBody,
  PostCommentsUploadBody,
  GetCommentsResponse,
  PostCommentsReactionsByCommentIdBody,
  PostCommentsUploadResponse,
  PutCommentsByIdBody,
  CommentsMentionQueryParams,
  CommentsQueryParams,
} from 'lib/components/comment/Comment.vue.d';
import { GetMentionSuggestionResponse } from 'lib/components/editor/Editor.vue.d';
import { getBaseURL } from 'lib/utils/getBaseURL.util';
import { io, Socket } from 'socket.io-client';

const BASE_URL = getBaseURL('APP_COMMENTS_API');
const user = JSON.parse(localStorage.getItem('user') as string) ?? {};

const API = ({ headers = {}, params = {} } = {}): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/comments`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + user.jwt,
      ...headers,
    },
    params,
  });

  return instance;
};

export const CommentServices = {
  postComments: (body: PostCommentsBody): Promise<AxiosResponse> => {
    return API().post('', body);
  },

  getCommentsByObjectId: (
    objectId: string,
    params?: CommentsQueryParams,
  ): Promise<AxiosResponse<GetCommentsResponse>> => {
    return API({ params }).get(`/${objectId}`);
  },

  getCommentsMention: (
    params: CommentsMentionQueryParams,
  ): Promise<AxiosResponse<GetMentionSuggestionResponse>> => {
    return API({ params }).get('/mention');
  },

  putCommentsById: (
    id: string,
    body: PutCommentsByIdBody,
  ): Promise<AxiosResponse> => {
    return API().put(`/${id}`, body);
  },

  postCommentsUpload: (
    body: PostCommentsUploadBody,
  ): Promise<AxiosResponse<PostCommentsUploadResponse>> => {
    return API({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).post('/upload', body);
  },

  postCommentsReactionsByCommentId: (
    commentId: string,
    body: PostCommentsReactionsByCommentIdBody,
  ): Promise<AxiosResponse> => {
    return API().post(`/reactions/${commentId}`, body);
  },

  deleteCommentsReactionsByCommentId: (
    commentId: string,
  ): Promise<AxiosResponse> => {
    return API().delete(`/reactions/${commentId}`);
  },

  commentSocketIo: (): Socket =>
    io(BASE_URL, {
      extraHeaders: {
        authorization: `Bearer ${user.jwt}`,
      },
    }),
};
