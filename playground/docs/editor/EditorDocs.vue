<script setup lang="ts">
import { ref } from 'vue';
import { ImageProperties, PostImage } from 'lib/components/editor/Editor.vue.d';

import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Editor from 'lib/components/editor/Editor.vue';
import Form from 'lib/components/form/Form.vue';

const editorContent = ref({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'Header Editor',
        },
      ],
    },
    {
      type: 'paragraph',
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Nama : Editor',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Editor State : readonly',
        },
      ],
    },
    {
      type: 'paragraph',
    },
  ],
});
const deletedImageState = ref<string>();

const sendImage = (value: PostImage): void => {
  value.setImageCb('https://www.svgrepo.com/show/452030/avatar-default.svg');
};

const deleteImage = (value: ImageProperties): void => {
  deletedImageState.value = value.src;
};

const formSubmit = (data) => {
  console.log(data);
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
        @delete-image-local="deleteImage"
        @post-image-local="sendImage"
        editor-state="readonly"
        placeholder="Tulis Deskripsi"
        use-validator
      />

      <Form
        :buttons-template="['submit', 'clear']"
        @submit="formSubmit"
        hide-stay-checkbox
      >
        <template #fields>
          <Editor
            :show-optional-text="false"
            @delete-image-local="deleteImage"
            @post-image-local="sendImage"
            editor-state="editable"
            label="Edtor Content"
            placeholder="Tulis Deskripsi"
            use-validator
          />
        </template>
      </Form>

      <div v-if="deletedImageState">
        <p>Deleted Image</p>
        <img :src="deletedImageState" />
      </div>
    </template>
  </Card>
</template>
