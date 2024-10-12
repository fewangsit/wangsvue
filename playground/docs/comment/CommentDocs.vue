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
          _id: '66f2876214c6d63fb6ab3f17',
          fullName: 'Super Admins',
          profilePicture: getImageURL(
            '/members/1726721700029-big.webp',
          ) as string,
        }"
        comment-type="module"
        object-id="66f2876214c6d63fb6ab3f17"
      />
    </template>
  </Card>
</template>
