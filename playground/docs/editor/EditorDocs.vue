<script setup lang="ts">
import { ref } from 'vue';
import {
  PostImage,
  GetMentionSuggestionResponse,
} from 'lib/components/editor/Editor.vue.d';
import Editor from 'lib/components/editor/Editor.vue';
import Form from 'lib/components/form/Form.vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';

const editorContent = ref({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'asdsad',
        },
      ],
    },
    {
      type: 'codeSnippet',
      attrs: { code: '' },
    },
  ],
});

const mentionedList = ref();

const sendImage = (value: PostImage): void => {
  value.setImageCb('https://www.svgrepo.com/show/452030/avatar-default.svg');
};

const submitForm = (): void => {
  //
};

const fetchMentionSuggestion =
  async (): Promise<GetMentionSuggestionResponse> => {
    return {
      data: [
        {
          _id: '1',
          fullName: 'Sir Alex',
        },
        {
          _id: '2',
          fullName: 'Cak Rusdi',
        },
      ],
      message: 'Successs',
      status: 200,
    };
  };
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Editor" />
    </template>
    <template #content>
      <div class="flex flex-col gap-4">
        <Form
          :buttons-template="['submit', 'cancel']"
          :reset-after-submit="false"
          @submit="submitForm"
        >
          <template #fields>
            <Editor
              v-model:mentioned-list="mentionedList"
              :fetch-mention-suggestion-function="fetchMentionSuggestion"
              :show-optional-text="false"
              is-image-upload-base64
              label="Editor"
              placeholder="asdsa"
              use-validator
            />
          </template>
        </Form>

        <Editor
          :initial-value="editorContent"
          @post-image-local="sendImage"
          label="Editor Using Base 64 Image"
          placeholder="asdsa"
        />
      </div>
    </template>
  </Card>
</template>
