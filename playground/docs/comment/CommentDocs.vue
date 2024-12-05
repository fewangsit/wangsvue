<script setup lang="ts">
import { GetCommentsResponse } from 'lib/components/comment/Comment.vue.d';
import { getImageURL } from 'lib/utils';
import Card from 'lib/components/card/Card.vue';
import Comment from 'lib/components/comment/Comment.vue';
import DocTitle from '../DocTitle.vue';

const data: GetCommentsResponse = {
  status: 200,
  message: 'Successfully retrieved comments',
  data: [
    {
      _id: 'comment-001',
      replyToId: '',
      type: 'ticket',
      objectId: 'object-001',
      sender: {
        _id: 'user-001',
        name: 'Alice Johnson',
        profilePicture: 'https://example.com/profiles/alice.jpg',
      },
      reactions: [],
      replies: [
        {
          _id: 'comment-002',
          replyToId: 'comment-001',
          type: 'ticket',
          objectId: 'object-001',
          sender: {
            _id: 'user-002',
            name: 'Bob Smith',
            profilePicture: 'https://example.com/profiles/bob.jpg',
          },
          reactions: [],
          replies: [],
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'I agree with Alice!' }],
              },
              {
                type: 'image',
                attrs: {
                  src: 'https://example.com/images/sample.jpg',
                  alt: 'Sample image',
                },
              },
            ],
          },
          createdAt: '2024-10-25T10:20:30.000Z',
        },
      ],
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is the main comment content by Alice.',
              },
            ],
          },
          {
            type: 'image',
            attrs: {
              src: 'https://example.com/images/main.jpg',
              alt: 'Main image',
            },
          },
        ],
      },
      createdAt: '2024-10-25T10:00:00.000Z',
      editedAt: null,
    },
  ],
};
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Comment" />
    </template>
    <template #content>
      <Comment
        :data="data"
        :query-params="{
          search: 'itu',
        }"
        :user="{
          _id: '66d1771c1ebe5344bc2b9dab',
          name: 'Super Admins',
          profilePicture: getImageURL(
            '/members/1726721700029-big.webp',
          ) as string,
        }"
        comment-type="module"
        object-id="6729a27bf65b6f68578b4dc4"
      />
    </template>
  </Card>
</template>
