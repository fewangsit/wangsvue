<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  PostImage,
  GetMentionSuggestionResponse,
} from 'lib/components/editor/Editor.vue.d';
import Editor from 'lib/components/editor/Editor.vue';
import Form from 'lib/components/form/Form.vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';

const mentionedList = ref();

const editorRef = ref();

const sendImage = (value: PostImage): void => {
  value.setImageCb('https://www.svgrepo.com/show/452030/avatar-default.svg');
};

const submitForm = (data: FormPayload): void => {
  console.error(data);
};

const fetchMentionSuggestion =
  async (): Promise<GetMentionSuggestionResponse> => {
    return {
      data: [
        {
          _id: '1',
          fullName: 'Sir Alex',
          nickName: 'alex',
          profilePicture: '',
        },
        {
          _id: '2',
          fullName: 'Cak Rudi',
          nickName: 'rudi',
          profilePicture: '',
        },
      ],
      message: 'Successs',
      status: 200,
    };
  };

onMounted(() => {
  editorRef.value.mentionSectionTrigger('Attachments');
});
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
              ref="editorRef"
              v-model:mentioned-list="mentionedList"
              :fetch-mention-suggestion-function="fetchMentionSuggestion"
              :show-optional-text="false"
              :validator-message="{
                empty: 'Ga Boleh Kosong',
              }"
              is-image-upload-base64
              label="Editor"
              mandatory
              placeholder="asdsa"
              toolbar-wrapper-class="bg-transparent"
              use-validator
            />
          </template>
        </Form>

        <Editor
          ref="editorRef"
          @post-image-local="sendImage"
          label="Editor Using Base 64 Image"
          placeholder="asdsa"
        />
      </div>
    </template>
  </Card>
</template>
