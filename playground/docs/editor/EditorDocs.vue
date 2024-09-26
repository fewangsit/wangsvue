<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Editor from 'lib/components/editor/Editor.vue';
import { ref } from 'vue';
import { PostImage } from 'lib/components/editor/Editor.vue.d';

const editorContent = ref({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'asdsadasd',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'asdasd',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'sad',
        },
      ],
    },
    {
      type: 'paragraph',
    },
  ],
});

const sendImage = (value: PostImage): void => {
  value.setImageCb('https://www.svgrepo.com/show/452030/avatar-default.svg');
};
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Editor" />
    </template>
    <template #content>
      <Editor
        v-model:model-value="editorContent"
        @post-image-local="sendImage"
      />
    </template>
  </Card>
</template>
