<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import Comment from 'lib/components/comment/Comment.vue';
import DocTitle from '../DocTitle.vue';
import { getImageURL } from 'lib/utils';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Comment" />
    </template>
    <template #content>
      <Comment
        :user="{
          _id: '66c833f028754c4f75532f00',
          fullName: 'Super Admins',
          profilePicture: getImageURL(
            '/members/1726721700029-big.webp',
          ) as string,
        }"
        comment-type="ticket"
        object-id="66eaa68cfa36b1a0edc3b692"
      />
    </template>
  </Card>
</template>
